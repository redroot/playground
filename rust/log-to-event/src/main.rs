use std::path::PathBuf;
use std::fs::File;
use std::io::{self, Write, BufRead, BufReader};
use std::collections::HashMap;
use anyhow::{Result, anyhow};
use structopt::StructOpt;
use serde::{Deserialize, Serialize};
use serde_json;

const LOG_COLUMN_SEPARATOR: char = ';';

#[derive(Debug, StructOpt)]
struct Opts {
    #[structopt(parse(from_os_str))]
    infile: PathBuf,
    // mode = event_summary/e || pageviews || conversions || for user
    // user id for user 
}

#[derive(Serialize, Deserialize, Debug)]
struct ConversionEventPayload {
    user_id: i32,
    amount: f32
}

#[derive(Serialize, Deserialize, Debug)]
struct ViewedPageEventPayload {
    user_id: i32,
    path: String,
    query: String
}

#[derive(Debug)]
enum EventType {
    ViewedPage(ViewedPageEventPayload),
    Conversion(ConversionEventPayload)
}

trait EventSummary {
    // new: any initial setup needed, e.g. initialise summary variables
    fn new() -> Self;
    // ingest: take in an event and summarise
    fn ingest(&mut self, event: &EventType) -> ();
    // // summarize, produces a string of the summary results
    fn summarize(&self) -> String;
}

#[derive(Debug)]
struct ViewedPageSummary {
    pageview_counter: HashMap<String, i32>,
    total_counter: i32
}

impl EventSummary for ViewedPageSummary {
    fn new() -> ViewedPageSummary {
        ViewedPageSummary { pageview_counter: HashMap::new(), total_counter: 0 }
    }

    fn ingest(&mut self, event: &EventType) -> () {
        match event {
            EventType::ViewedPage(payload) => {
                let current = self.pageview_counter.entry(payload.path.clone()).or_insert(0);
                *current += 1;
                self.total_counter += 1;
                ()
            },
            _ => ()
        };
    }

    fn summarize(&self) -> String {
        let mut base = String::from("Pageview Summary\n------------\n");
        let totals = format!("Total: {}\n", self.total_counter);
        for (key, value) in self.pageview_counter.clone() {
            let line = format!("{}\t\t\t{}\n", key, value);
            base.push_str(&line);
        }
        base.push_str("-----------\n");
        base.push_str(&totals);
        base
    }
} 

// some redundancy across these two files
fn build_viewed_page_event(parts: &Vec<&str>) -> Result<EventType> {
    let payload: ViewedPageEventPayload = serde_json::from_str(parts[1])?;
    Ok(EventType::ViewedPage(payload)) // could probably have used result.map here FP still if it wasnt for anyhow
}

// can do smarter things here eventually, e.g. sensible defaults or parsing
fn build_conversion_event(parts: &Vec<&str>) -> Result<EventType> {
    let payload: ConversionEventPayload = serde_json::from_str(parts[1])?;
    Ok(EventType::Conversion(payload))
}

fn process_line(raw: String) -> Result<EventType> {
    let parts: Vec<&str> = raw.split(LOG_COLUMN_SEPARATOR).collect();
    let result = match parts[0] {
        "Viewed Page" => build_viewed_page_event(&parts),
        "Conversion" => build_conversion_event(&parts),
        unknown => Err(anyhow!("Unknown event type {:?}", unknown))
    };
    result
}


fn process_file(path: &PathBuf) -> Result<()> {
    let file = File::open(path.to_str().unwrap())?;
    let reader = BufReader::new(file);

    // next up, switch out the summary based on command e.g. Webpage Summary
    let mut summarizer = ViewedPageSummary::new();

    for line in reader.lines() {
        let event_result = process_line(line.unwrap());
        match event_result {
            Ok(event) => summarizer.ingest(&event),
            Err(_) => ()
        }
    }

    io::stdout().write_all(summarizer.summarize().as_bytes())?;

    Ok(())
}

fn main() -> Result<()> {
    let opts = Opts::from_args();
    process_file(&opts.infile)
}


// 3) add Conversion summary mode

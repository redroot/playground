use std::path::PathBuf;
use std::fs::File;
use std::io::{BufRead, BufReader};
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
    pageview_counter: HashMap<String, i32>
}

impl EventSummary for ViewedPageSummary {
    fn new() -> ViewedPageSummary {
        ViewedPageSummary { pageview_counter: HashMap::new()}
    }

    fn ingest(&mut self, event: &EventType) -> () {
        match event {
            EventType::ViewedPage(payload) => {
                let current = self.pageview_counter.entry(payload.path.clone()).or_insert(0);
                *current += 1;
                ()
            },
            _ => ()
        };
    }

    fn summarize(&self) -> String {
        String::from(format!("We found page views! And pageview counter {:?}", self.pageview_counter))
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

    println!("Summarised: {:?}", summarizer.summarize());

    Ok(())
}

fn main() -> Result<()> {
    let opts = Opts::from_args();
    process_file(&opts.infile)
}


// inject collector based on commands, process each line and run through collector after conversion
// build a result object and then send to std out at the end
// implement using a trait, handle_event, internal counters etc

// Todo 
// 2) add Viewed Page summary mode
// 3) add Conversion summary mode
// add total pageview, iterator over in atable format with colours to std out

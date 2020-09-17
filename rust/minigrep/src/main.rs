use std::env;
use std::process;
use minigrep::Config;

// library that except two argument $ cargo run searchstring example-filename.txt
// main.rs should contain the command line parsing if its simply, but logic should live in lib.rs
// and command line parsing after that if it starts to get complex
fn main() {
    let args: Vec<String> = env::args().collect();

    let config = Config::new(&args).unwrap_or_else(|err| {
        println!("Problem parsing arguments: {}", err);
        process::exit(1);
    });

    // pattern match against an error occuring
    if let Err(e) = minigrep::run(config) {
        println!("Application error: {}", e);

        process::exit(1);
    }
}


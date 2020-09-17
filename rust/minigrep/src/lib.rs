use std::fs;
use std::error::Error;

// the error type is one that implements the Error trait, wrapped in a box so we dont have to worry
// about allocated to the stack at compile time as it is unsized.
pub fn run(config: Config) -> Result<(), Box<dyn Error>> {
    let contents = fs::read_to_string(config.filename)?; // this returns early with the error so the caller can handle it

    for line in search(&config.query, &contents) {
      println!("{}", line);
    }

    Ok(())
}

// the 'a means that the variables tagged need to live at least as long as the function
// if we dont do this the compiler wont understand that the result type is part of contents
// and might do its static checking incorrectly 
pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
  contents
    .lines()
    .filter(|line| line.contains(query))
    .collect()
}

pub struct Config {
    query: String,
    filename: String
}

impl Config {
    // second type is the error type, a string literal, static meaning its lifetime is the same as the program
    pub fn new(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }
        // in general clone is frowned upon due to runtime cost, but fine for this
        let query = args[1].clone(); // cloning mean we're making new objects so no ownership clash bash to main
        let filename = args[2].clone(); // and therefore we no longer need to use & to borrow ownership while we reference them

        Ok(Config { query, filename })
    }
}

// tests are under this cfg
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn one_result() {
        let query = "duct";
        let contents = "\
Rust:
safe, fast, productive.
Pick three.";

        assert_eq!(vec!["safe, fast, productive."], search(query, contents));
    }
}
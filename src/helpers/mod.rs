pub mod cli;
pub mod comparison;
pub mod compiled;
pub mod devserver;
pub mod fixtures;
pub mod markers;
pub mod project;
pub mod reference;
pub mod remote;
pub mod test_store;

/// Determines if a test path represents a single .typ file
pub fn is_single_file_test(path: &str) -> bool {
    path.ends_with(".typ")
}

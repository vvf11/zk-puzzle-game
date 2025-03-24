use sp1_core::{SP1Program, SP1Verifier};

#[derive(Debug)]
pub struct PuzzleInput {
    pub num1: u32,
    pub num2: u32,
    pub operation: char,
    pub answer: u32,
}

impl SP1Program for PuzzleInput {
    fn verify(&self) -> bool {
        match self.operation {
            '+' => self.num1 + self.num2 == self.answer,
            '-' => self.num1 - self.num2 == self.answer,
            '*' => self.num1 * self.num2 == self.answer,
            _ => false,
        }
    }
}

pub fn verify_puzzle(input: PuzzleInput) -> bool {
    let verifier = SP1Verifier::new();
    verifier.verify(&input)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_addition() {
        let input = PuzzleInput {
            num1: 5,
            num2: 3,
            operation: '+',
            answer: 8,
        };
        assert!(verify_puzzle(input));
    }

    #[test]
    fn test_multiplication() {
        let input = PuzzleInput {
            num1: 4,
            num2: 6,
            operation: '*',
            answer: 24,
        };
        assert!(verify_puzzle(input));
    }
} 
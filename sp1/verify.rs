use sp1_core::{SP1Program, SP1Verifier};

#[derive(Debug)]
pub struct TreasureInput {
    pub level: u32,
    pub x: u32,
    pub y: u32,
    pub expected_x: u32,
    pub expected_y: u32,
}

impl SP1Program for TreasureInput {
    fn verify(&self) -> bool {
        // Проверяем, что координаты совпадают с ожидаемыми
        self.x == self.expected_x && self.y == self.expected_y
    }
}

pub fn verify_treasure(input: TreasureInput) -> bool {
    let verifier = SP1Verifier::new();
    verifier.verify(&input)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_correct_coordinates() {
        let input = TreasureInput {
            level: 1,
            x: 5,
            y: 3,
            expected_x: 5,
            expected_y: 3,
        };
        assert!(verify_treasure(input));
    }

    #[test]
    fn test_incorrect_coordinates() {
        let input = TreasureInput {
            level: 1,
            x: 5,
            y: 3,
            expected_x: 4,
            expected_y: 3,
        };
        assert!(!verify_treasure(input));
    }
} 
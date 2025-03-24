use sp1_core::{SP1Program, SP1Verifier};
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Gate {
    pub gate_type: String,
    pub inputs: Vec<u32>,
    pub output: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Circuit {
    pub gates: Vec<Gate>,
}

#[derive(Debug)]
pub struct LogicInput {
    pub level: u32,
    pub circuit: Circuit,
}

impl SP1Program for LogicInput {
    fn verify(&self) -> bool {
        match self.level {
            1 => verify_and_gate(&self.circuit),
            2 => verify_or_gate(&self.circuit),
            3 => verify_not_gate(&self.circuit),
            4 => verify_xor_gate(&self.circuit),
            _ => false,
        }
    }
}

fn verify_and_gate(circuit: &Circuit) -> bool {
    // Проверяем, что схема содержит AND вентиль с правильными входами и выходом
    if let Some(gate) = circuit.gates.iter().find(|g| g.gate_type == "AND") {
        // Проверяем, что у вентиля два входа
        if gate.inputs.len() != 2 {
            return false;
        }

        // Проверяем правильность вычисления
        let expected_output = if gate.inputs[0] == 1 && gate.inputs[1] == 1 { 1 } else { 0 };
        gate.output == expected_output
    } else {
        false
    }
}

fn verify_or_gate(circuit: &Circuit) -> bool {
    if let Some(gate) = circuit.gates.iter().find(|g| g.gate_type == "OR") {
        if gate.inputs.len() != 2 {
            return false;
        }

        let expected_output = if gate.inputs[0] == 1 || gate.inputs[1] == 1 { 1 } else { 0 };
        gate.output == expected_output
    } else {
        false
    }
}

fn verify_not_gate(circuit: &Circuit) -> bool {
    if let Some(gate) = circuit.gates.iter().find(|g| g.gate_type == "NOT") {
        if gate.inputs.len() != 1 {
            return false;
        }

        let expected_output = if gate.inputs[0] == 1 { 0 } else { 1 };
        gate.output == expected_output
    } else {
        false
    }
}

fn verify_xor_gate(circuit: &Circuit) -> bool {
    if let Some(gate) = circuit.gates.iter().find(|g| g.gate_type == "XOR") {
        if gate.inputs.len() != 2 {
            return false;
        }

        let expected_output = if gate.inputs[0] != gate.inputs[1] { 1 } else { 0 };
        gate.output == expected_output
    } else {
        false
    }
}

pub fn verify_logic_circuit(input: LogicInput) -> bool {
    let verifier = SP1Verifier::new();
    verifier.verify(&input)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_and_gate() {
        let circuit = Circuit {
            gates: vec![
                Gate {
                    gate_type: "AND".to_string(),
                    inputs: vec![1, 1],
                    output: 1,
                },
            ],
        };
        let input = LogicInput {
            level: 1,
            circuit,
        };
        assert!(verify_logic_circuit(input));
    }

    #[test]
    fn test_or_gate() {
        let circuit = Circuit {
            gates: vec![
                Gate {
                    gate_type: "OR".to_string(),
                    inputs: vec![1, 0],
                    output: 1,
                },
            ],
        };
        let input = LogicInput {
            level: 2,
            circuit,
        };
        assert!(verify_logic_circuit(input));
    }

    #[test]
    fn test_not_gate() {
        let circuit = Circuit {
            gates: vec![
                Gate {
                    gate_type: "NOT".to_string(),
                    inputs: vec![1],
                    output: 0,
                },
            ],
        };
        let input = LogicInput {
            level: 3,
            circuit,
        };
        assert!(verify_logic_circuit(input));
    }
} 
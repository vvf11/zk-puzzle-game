class LogicGate {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.inputs = [];
        this.output = null;
        this.element = null;
        this.inputPoints = [];
        this.outputPoint = null;
    }

    evaluate() {
        switch(this.type) {
            case 'AND':
                return this.inputs.length === 2 && this.inputs.every(input => input === 1) ? 1 : 0;
            case 'OR':
                return this.inputs.some(input => input === 1) ? 1 : 0;
            case 'NOT':
                return this.inputs[0] === 1 ? 0 : 1;
            case 'XOR':
                return this.inputs.filter(input => input === 1).length === 1 ? 1 : 0;
            default:
                return 0;
        }
    }

    createVisual() {
        const gate = document.createElement('div');
        gate.className = 'gate';
        gate.textContent = this.type;
        gate.style.left = `${this.x}px`;
        gate.style.top = `${this.y}px`;
        
        // Добавляем точки подключения
        const inputCount = this.type === 'NOT' ? 1 : 2;
        for(let i = 0; i < inputCount; i++) {
            const input = document.createElement('div');
            input.className = 'connection-point input';
            input.style.left = '-5px';
            input.style.top = `${(i + 1) * (60 / (inputCount + 1))}px`;
            this.inputPoints.push(input);
            gate.appendChild(input);
        }

        const output = document.createElement('div');
        output.className = 'connection-point output';
        output.style.right = '-5px';
        output.style.top = '30px';
        this.outputPoint = output;
        gate.appendChild(output);

        this.element = gate;
        return gate;
    }
}

class Circuit {
    constructor() {
        this.gates = [];
        this.wires = [];
        this.board = document.getElementById('circuit-board');
        this.draggedGate = null;
        this.wireStart = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Обработка перетаскивания вентилей из панели инструментов
        const gateItems = document.querySelectorAll('.gate-item');
        gateItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                const gateType = item.getAttribute('data-gate');
                e.dataTransfer.setData('text/plain', gateType);
            });
        });

        // Обработка событий на рабочей области
        this.board.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        this.board.addEventListener('drop', (e) => {
            e.preventDefault();
            const gateType = e.dataTransfer.getData('text/plain');
            const rect = this.board.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.addGate(gateType, x, y);
        });
    }

    addGate(type, x, y) {
        const gate = new LogicGate(type, x, y);
        this.gates.push(gate);
        const visual = gate.createVisual();
        
        // Добавляем обработчики для перемещения вентиля
        visual.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('connection-point')) return;
            this.draggedGate = {gate, offsetX: e.offsetX, offsetY: e.offsetY};
        });

        // Добавляем обработчики для создания проводов
        gate.inputPoints.forEach(point => {
            point.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                this.wireStart = {gate, point, isInput: true};
            });
        });

        gate.outputPoint.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            this.wireStart = {gate, point: gate.outputPoint, isInput: false};
        });

        this.board.appendChild(visual);
    }

    addWire(start, end) {
        const wire = document.createElement('div');
        wire.className = 'wire';
        const startRect = start.point.getBoundingClientRect();
        const endRect = end.point.getBoundingClientRect();
        const boardRect = this.board.getBoundingClientRect();

        const startX = startRect.left - boardRect.left;
        const startY = startRect.top - boardRect.top;
        const endX = endRect.left - boardRect.left;
        const endY = endRect.top - boardRect.top;

        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const angle = Math.atan2(endY - startY, endX - startX);

        wire.style.width = `${length}px`;
        wire.style.left = `${startX}px`;
        wire.style.top = `${startY}px`;
        wire.style.transform = `rotate(${angle}rad)`;

        this.wires.push({
            element: wire,
            start,
            end
        });

        this.board.appendChild(wire);
    }

    evaluate() {
        // Сбрасываем все входы и выходы
        this.gates.forEach(gate => {
            gate.inputs = [];
            gate.output = null;
        });

        // Вычисляем значения для каждого вентиля
        let changed = true;
        while (changed) {
            changed = false;
            this.gates.forEach(gate => {
                if (gate.output === null && gate.inputs.length === (gate.type === 'NOT' ? 1 : 2)) {
                    gate.output = gate.evaluate();
                    changed = true;
                }
            });
        }

        return this.gates.map(gate => ({
            type: gate.type,
            inputs: gate.inputs,
            output: gate.output
        }));
    }
}

class ZKLogicGame {
    constructor() {
        this.circuit = new Circuit();
        this.level = 1;
        this.proof = null;
    }

    async verifyCircuit() {
        const evaluation = this.circuit.evaluate();
        
        // Генерируем ZK доказательство
        const proof = await this.generateProof({
            level: this.level,
            circuit: evaluation
        });

        this.proof = proof;
        return {
            success: this.checkCircuit(evaluation),
            proof
        };
    }

    checkCircuit(evaluation) {
        // Проверяем, соответствует ли схема требованиям уровня
        switch(this.level) {
            case 1:
                // Проверяем реализацию AND
                const andGate = evaluation.find(gate => gate.type === 'AND');
                return andGate && andGate.output === 1 && andGate.inputs.every(input => input === 1);
            // Добавим другие уровни позже
            default:
                return false;
        }
    }

    async generateProof(data) {
        // Здесь будет интеграция с SP1
        return {
            proof: 'dummy_proof',
            publicInputs: [data.level, JSON.stringify(data.circuit)]
        };
    }
}

// Инициализация игры
const game = new ZKLogicGame();
window.game = game;

// Добавляем глобальную функцию для проверки схемы
window.verifyCircuit = async function() {
    const result = await game.verifyCircuit();
    const proofOutput = document.getElementById('proof-output');
    
    if (result.success) {
        proofOutput.textContent = `Схема верна! Доказательство: ${JSON.stringify(result.proof)}`;
        proofOutput.classList.add('success');
        setTimeout(() => {
            game.level++;
            // Обновляем информацию об уровне
            // TODO: Добавить обновление описания и таблицы истинности
        }, 2000);
    } else {
        proofOutput.textContent = 'Схема неверна. Попробуйте еще раз.';
        proofOutput.classList.remove('success');
    }
}; 
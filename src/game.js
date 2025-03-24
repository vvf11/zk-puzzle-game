class ZKPuzzleGame {
    constructor() {
        this.score = 0;
        this.currentPuzzle = null;
        this.proof = null;
    }

    generatePuzzle() {
        // Генерируем случайную математическую задачу
        const num1 = Math.floor(Math.random() * 100);
        const num2 = Math.floor(Math.random() * 100);
        const operation = ['+', '-', '*'][Math.floor(Math.random() * 3)];
        
        let answer;
        switch(operation) {
            case '+':
                answer = num1 + num2;
                break;
            case '-':
                answer = num1 - num2;
                break;
            case '*':
                answer = num1 * num2;
                break;
        }

        this.currentPuzzle = {
            num1,
            num2,
            operation,
            answer
        };

        return `Решите: ${num1} ${operation} ${num2} = ?`;
    }

    async verifySolution(userAnswer) {
        if (!this.currentPuzzle) {
            throw new Error('Нет активной головоломки');
        }

        if (userAnswer === this.currentPuzzle.answer) {
            // Генерируем ZK доказательство
            const proof = await this.generateProof({
                num1: this.currentPuzzle.num1,
                num2: this.currentPuzzle.num2,
                operation: this.currentPuzzle.operation,
                answer: userAnswer
            });

            this.proof = proof;
            this.score += 10;
            return true;
        }

        return false;
    }

    async generateProof(data) {
        // Здесь будет интеграция с SP1
        // TODO: Реализовать генерацию доказательства
        return {
            proof: 'dummy_proof',
            publicInputs: [data.num1, data.num2, data.answer]
        };
    }

    getScore() {
        return this.score;
    }
}

// Инициализация игры
const game = new ZKPuzzleGame();
export default game; 
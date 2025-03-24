class ZKTreasureHunt {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.treasure = null;
        this.hints = [];
        this.proof = null;
        this.maxLevel = 5;
    }

    generateLevel() {
        // Генерируем координаты сокровища
        const x = Math.floor(Math.random() * 100);
        const y = Math.floor(Math.random() * 100);
        
        // Создаем математическую головоломку для нахождения координат
        const puzzle = this.generatePuzzle(x, y);
        
        this.treasure = { x, y };
        this.hints = puzzle.hints;
        
        return {
            level: this.level,
            hints: puzzle.hints,
            maxAttempts: 3
        };
    }

    generatePuzzle(x, y) {
        const hints = [];
        
        // Генерируем подсказки в зависимости от уровня
        switch(this.level) {
            case 1:
                hints.push(`Сумма координат равна ${x + y}`);
                hints.push(`Произведение координат равно ${x * y}`);
                break;
            case 2:
                hints.push(`X больше Y на ${x - y}`);
                hints.push(`Сумма цифр X равна ${this.sumDigits(x)}`);
                break;
            case 3:
                hints.push(`X делится на ${this.getDivisors(x).join(', ')}`);
                hints.push(`Y является ${this.isPrime(y) ? 'простым' : 'составным'} числом`);
                break;
            case 4:
                hints.push(`X в двоичной системе: ${x.toString(2)}`);
                hints.push(`Y в шестнадцатеричной системе: ${y.toString(16)}`);
                break;
            case 5:
                hints.push(`X является ${this.isFibonacci(x) ? 'числом Фибоначчи' : 'не является числом Фибоначчи'}`);
                hints.push(`Y является ${this.isPerfectSquare(y) ? 'квадратом целого числа' : 'не является квадратом целого числа'}`);
                break;
        }
        
        return { hints };
    }

    async checkSolution(userX, userY) {
        if (!this.treasure) {
            throw new Error('Игра не инициализирована');
        }

        const isCorrect = userX === this.treasure.x && userY === this.treasure.y;
        
        if (isCorrect) {
            // Генерируем ZK доказательство
            const proof = await this.generateProof({
                level: this.level,
                x: userX,
                y: userY,
                expectedX: this.treasure.x,
                expectedY: this.treasure.y
            });

            this.proof = proof;
            this.score += this.level * 100;
            
            if (this.level < this.maxLevel) {
                this.level++;
            }
            
            return {
                success: true,
                score: this.score,
                level: this.level,
                proof
            };
        }

        return {
            success: false,
            message: 'Неверные координаты! Попробуйте еще раз.'
        };
    }

    async generateProof(data) {
        // Здесь будет интеграция с SP1
        return {
            proof: 'dummy_proof',
            publicInputs: [data.level, data.x, data.y]
        };
    }

    // Вспомогательные функции
    sumDigits(num) {
        return num.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }

    getDivisors(num) {
        const divisors = [];
        for (let i = 2; i <= num; i++) {
            if (num % i === 0) divisors.push(i);
        }
        return divisors;
    }

    isPrime(num) {
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false;
        }
        return num > 1;
    }

    isFibonacci(num) {
        let a = 0, b = 1;
        while (b <= num) {
            if (b === num) return true;
            const temp = a + b;
            a = b;
            b = temp;
        }
        return false;
    }

    isPerfectSquare(num) {
        const sqrt = Math.sqrt(num);
        return Math.floor(sqrt) === sqrt;
    }

    getScore() {
        return this.score;
    }

    getLevel() {
        return this.level;
    }
}

// Инициализация игры
const game = new ZKTreasureHunt();
export default game; 
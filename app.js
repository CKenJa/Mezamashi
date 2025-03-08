/**
 * 微積分問題の生成と検証を行うクラス
 */
class CalculusProblems {
    constructor() {
        this.currentProblem = null;
        this.currentAnswer = null;
        this.difficultyLevel = 1; // 1: 簡単, 2: 普通, 3: 難しい
    }

    /**
     * 問題の難易度を設定
     * @param {number} level - 難易度レベル (1-3)
     */
    setDifficulty(level) {
        if (level >= 1 && level <= 3) {
            this.difficultyLevel = level;
        }
    }

    /**
     * ランダムな微積分問題を生成
     * @returns {string} 問題文
     */
    generateProblem() {
        const problemTypes = [
            this.generateDerivativeProblem,
            this.generateIntegralProblem,
            this.generateLimitProblem
        ];
        
        // ランダムに問題タイプを選択
        const randomType = Math.floor(Math.random() * problemTypes.length);
        return problemTypes[randomType].call(this);
    }

    /**
     * 微分問題の生成
     * @returns {string} 問題文
     */
    generateDerivativeProblem() {
        let problem, answer;
        
        switch(this.difficultyLevel) {
            case 1: // 簡単
                const a = this.getRandomInt(1, 10);
                const b = this.getRandomInt(1, 5);
                problem = `f(x) = ${a}x^${b} の導関数 f'(x) を求めよ。`;
                answer = `${a * b}x^${b - 1}`;
                break;
                
            case 2: // 普通
                const c = this.getRandomInt(1, 5);
                const d = this.getRandomInt(1, 5);
                const e = this.getRandomInt(1, 10);
                problem = `f(x) = ${c}x^${d} + ${e}sin(x) の導関数 f'(x) を求めよ。`;
                answer = `${c * d}x^${d - 1} + ${e}cos(x)`;
                break;
                
            case 3: // 難しい
                const p = this.getRandomInt(2, 5);
                const q = this.getRandomInt(2, 5);
                problem = `f(x) = x^${p} * ln(x^${q}) の導関数 f'(x) を求めよ。`;
                answer = `${p}x^${p-1}*ln(x^${q}) + ${q}x^${p-1}`;
                break;
        }
        
        this.currentProblem = problem;
        this.currentAnswer = answer;
        return problem;
    }

    /**
     * 積分問題の生成
     * @returns {string} 問題文
     */
    generateIntegralProblem() {
        let problem, answer;
        
        switch(this.difficultyLevel) {
            case 1: // 簡単
                const a = this.getRandomInt(1, 5);
                const n = this.getRandomInt(2, 4);
                problem = `∫ ${a}x^${n} dx を求めよ。`;
                answer = `${a}x^${n+1}/${n+1} + C`;
                break;
                
            case 2: // 普通
                const b = this.getRandomInt(1, 5);
                problem = `∫ ${b}sin(x) dx を求めよ。`;
                answer = `-${b}cos(x) + C`;
                break;
                
            case 3: // 難しい
                const c = this.getRandomInt(2, 5);
                problem = `∫ 1/x^${c} dx を求めよ。`;
                answer = `-1/${c-1}x^${c-1} + C`;
                break;
        }
        
        this.currentProblem = problem;
        this.currentAnswer = answer;
        return problem;
    }

    /**
     * 極限問題の生成
     * @returns {string} 問題文
     */
    generateLimitProblem() {
        let problem, answer;
        
        switch(this.difficultyLevel) {
            case 1: // 簡単
                const a = this.getRandomInt(1, 5);
                problem = `lim(x→∞) (${a} + 1/x) を求めよ。`;
                answer = `${a}`;
                break;
                
            case 2: // 普通
                const b = this.getRandomInt(1, 5);
                const c = this.getRandomInt(1, 5);
                problem = `lim(x→∞) (${b}x^2 + ${c}x)/${b}x^2 を求めよ。`;
                answer = `1`;
                break;
                
            case 3: // 難しい
                problem = `lim(x→0) (sin(x)/x) を求めよ。`;
                answer = `1`;
                break;
        }
        
        this.currentProblem = problem;
        this.currentAnswer = answer;
        return problem;
    }

    /**
     * 回答が正しいか検証
     * @param {string} userAnswer - ユーザーの回答
     * @returns {boolean} 正解かどうか
     */
    checkAnswer(userAnswer) {
        if (!this.currentAnswer) return false;
        
        // 空白とケースを無視して比較（非常に単純な比較）
        const normalizedUserAnswer = userAnswer.trim().toLowerCase().replace(/\s+/g, '');
        const normalizedCorrectAnswer = this.currentAnswer.trim().toLowerCase().replace(/\s+/g, '');
        
        return normalizedUserAnswer === normalizedCorrectAnswer;
    }

    /**
     * 指定された範囲のランダムな整数を取得
     * @param {number} min - 最小値
     * @param {number} max - 最大値
     * @returns {number} ランダムな整数
     */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

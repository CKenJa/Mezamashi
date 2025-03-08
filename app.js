// アプリケーションのメインロジック
document.addEventListener('DOMContentLoaded', () => {
    // 要素の取得
    const currentTimeElement = document.getElementById('current-time');
    const alarmTimeInput = document.getElementById('alarm-time');
    const setAlarmButton = document.getElementById('set-alarm');
    const alarmStatusElement = document.getElementById('alarm-status');
    const problemContainer = document.getElementById('problem-container');
    const calculusProblemElement = document.getElementById('calculus-problem');
    const answerInput = document.getElementById('answer-input');
    const checkAnswerButton = document.getElementById('check-answer');
    const feedbackElement = document.getElementById('feedback');

    // インスタンスの作成
    const alarmController = new AlarmController();
    const calculusProblems = new CalculusProblems();
    
    // 問題管理のための状態
    let currentProblemId = '';

    // 現在時刻の表示を更新
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
        
        // アラームのチェック
        if (alarmController.checkAlarm(now)) {
            triggerAlarm();
        }
    }

    // アラームをトリガー
    function triggerAlarm() {
        alarmController.startAlarm();
        setAlarmButton.disabled = true;
        alarmStatusElement.textContent = 'アラーム作動中！問題を解いて止めてください。';
        
        // 問題生成と表示
        showCalculusProblem();
    }

    // 微積分問題を表示
    function showCalculusProblem() {
        // 前回と同じ問題IDがあるか確認
        const todayKey = alarmController.getTodayKey();
        const savedProblem = localStorage.getItem(`problem_${todayKey}`);
        
        let problem;
        if (savedProblem) {
            // 前回の問題を復元
            const problemData = JSON.parse(savedProblem);
            calculusProblems.currentProblem = problemData.problem;
            calculusProblems.currentAnswer = problemData.answer;
            problem = problemData.problem;
            currentProblemId = problemData.id || Date.now().toString();
        } else {
            // 新しい問題を生成
            problem = calculusProblems.generateProblem();
            currentProblemId = Date.now().toString();
            
            // 問題を保存
            localStorage.setItem(`problem_${todayKey}`, JSON.stringify({
                id: currentProblemId,
                problem: calculusProblems.currentProblem,
                answer: calculusProblems.currentAnswer,
                solved: false
            }));
        }
        
        calculusProblemElement.textContent = problem;
        problemContainer.classList.remove('hidden');
        answerInput.value = '';
        feedbackElement.textContent = '';
        feedbackElement.className = '';
    }

    // アラームのセットアップ
    setAlarmButton.addEventListener('click', () => {
        const selectedTime = alarmTimeInput.value;
        if (!selectedTime) {
            alert('時間を選択してください');
            return;
        }
        
        alarmController.setAlarm(selectedTime);
        alarmStatusElement.textContent = `アラーム設定時刻: ${selectedTime}`;
        setAlarmButton.disabled = false;
    });

    // 回答チェック
    checkAnswerButton.addEventListener('click', () => {
        const userAnswer = answerInput.value.trim();
        if (!userAnswer) {
            alert('回答を入力してください');
            return;
        }
        
        if (calculusProblems.checkAnswer(userAnswer)) {
            feedbackElement.textContent = '正解です！アラームを停止します。';
            feedbackElement.className = 'correct';
            
            // 問題を解決済みとしてマーク
            const todayKey = alarmController.getTodayKey();
            const savedProblem = localStorage.getItem(`problem_${todayKey}`);
            if (savedProblem) {
                const problemData = JSON.parse(savedProblem);
                problemData.solved = true;
                localStorage.setItem(`problem_${todayKey}`, JSON.stringify(problemData));
            }
            
            // アラームを停止
            setTimeout(() => {
                alarmController.stopAlarm(true); // 解決済みとしてアラームを停止
                problemContainer.classList.add('hidden');
                setAlarmButton.disabled = false;
                alarmStatusElement.textContent = 'アラームは設定されていません';
            }, 2000);
        } else {
            feedbackElement.textContent = '不正解です。もう一度試してください。';
            feedbackElement.className = 'incorrect';
            // 回答が間違っている回数を記録することもできます（オプション）
        }
    });

    // キーボードでエンターキーを押したときの処理
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswerButton.click();
        }
    });
    
    // アプリ開始時に状態をチェック
    function initApp() {
        // アラームがアクティブだった場合、アラームを再開
        if (alarmController.isActive()) {
            triggerAlarm();
        } else {
            // アラームタイムが設定されていれば表示
            if (alarmController.alarmTime) {
                alarmStatusElement.textContent = `アラーム設定時刻: ${alarmController.alarmTime}`;
            }
            
            // 今日の問題が解決されていない場合は表示
            const todayKey = alarmController.getTodayKey();
            const savedProblem = localStorage.getItem(`problem_${todayKey}`);
            if (savedProblem) {
                const problemData = JSON.parse(savedProblem);
                if (!problemData.solved && alarmController.isAlarmSet) {
                    showCalculusProblem();
                }
            }
        }
    }

    // 時計を開始
    setInterval(updateClock, 1000);
    updateClock(); // 初期表示
    
    // アプリの初期化
    initApp();
});

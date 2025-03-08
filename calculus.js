// アプリケーションのメインロジック
document.addEventListener('DOMContentLoaded', () => {
    // 要素の取得
    const currentTimeElement = document.getElementById('current-time');
    const alarmTimeInput = document.getElementById('alarm-time');
    const setAlarmButton = document.getElementById('set-alarm');
    const stopAlarmButton = document.getElementById('stop-alarm');
    const alarmStatusElement = document.getElementById('alarm-status');
    const problemContainer = document.getElementById('problem-container');
    const calculusProblemElement = document.getElementById('calculus-problem');
    const answerInput = document.getElementById('answer-input');
    const checkAnswerButton = document.getElementById('check-answer');
    const feedbackElement = document.getElementById('feedback');

    // インスタンスの作成
    const alarmController = new AlarmController();
    const calculusProblems = new CalculusProblems();

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
        stopAlarmButton.disabled = false;
        alarmStatusElement.textContent = 'アラーム作動中！問題を解いて止めてください。';
        
        // 問題生成と表示
        showCalculusProblem();
    }

    // 微積分問題を表示
    function showCalculusProblem() {
        const problem = calculusProblems.generateProblem();
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
        stopAlarmButton.disabled = false;
    });

    // アラームの停止
    stopAlarmButton.addEventListener('click', () => {
        alarmController.resetAlarm();
        problemContainer.classList.add('hidden');
        setAlarmButton.disabled = false;
        stopAlarmButton.disabled = true;
        alarmStatusElement.textContent = 'アラームは設定されていません';
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
            
            // アラームを停止
            setTimeout(() => {
                alarmController.stopAlarm();
                problemContainer.classList.add('hidden');
                setAlarmButton.disabled = false;
                stopAlarmButton.disabled = true;
                alarmStatusElement.textContent = 'アラームは設定されていません';
            }, 2000);
        } else {
            feedbackElement.textContent = '不正解です。もう一度試してください。';
            feedbackElement.className = 'incorrect';
            // 間違えたら新しい問題を表示（オプション）
            // showCalculusProblem();
        }
    });

    // キーボードでエンターキーを押したときの処理
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswerButton.click();
        }
    });

    // 時計を開始
    setInterval(updateClock, 1000);
    updateClock(); // 初期表示
});

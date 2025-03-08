/**
 * アラーム制御を行うクラス
 */
class AlarmController {
    constructor() {
        this.alarmTime = null;
        this.isAlarmSet = false;
        this.isAlarmActive = false;
        this.alarmSound = document.getElementById('alarm-sound');
        this.todayKey = this.getTodayKey();
        
        // ローカルストレージから状態を復元
        this.restoreState();
    }

    /**
     * 今日の日付キーを取得
     * @returns {string} YYYY-MM-DD 形式の日付文字列
     */
    getTodayKey() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    /**
     * ローカルストレージから状態を復元
     */
    restoreState() {
        // 今日のキーでアラーム状態を確認
        const todayKey = this.getTodayKey();
        const alarmState = localStorage.getItem(`alarm_${todayKey}`);
        
        if (alarmState) {
            const state = JSON.parse(alarmState);
            this.alarmTime = state.time || null;
            this.isAlarmSet = !!this.alarmTime;
            this.isAlarmActive = state.active || false;
        }
    }

    /**
     * 状態をローカルストレージに保存
     */
    saveState() {
        const state = {
            time: this.alarmTime,
            active: this.isAlarmActive,
            date: this.todayKey
        };
        localStorage.setItem(`alarm_${this.todayKey}`, JSON.stringify(state));
    }

    /**
     * アラームを設定
     * @param {string} timeString - HH:MM 形式の時刻文字列
     */
    setAlarm(timeString) {
        this.alarmTime = timeString;
        this.isAlarmSet = true;
        this.isAlarmActive = false;
        this.saveState();
        return true;
    }

    /**
     * アラーム時刻かどうかをチェック
     * @param {Date} currentTime - 現在時刻
     * @returns {boolean} アラーム時刻かどうか
     */
    checkAlarm(currentTime) {
        // 日付キーの更新と確認
        const newTodayKey = this.getTodayKey();
        if (newTodayKey !== this.todayKey) {
            // 日付が変わった場合、前日の状態をリセット
            this.todayKey = newTodayKey;
            
            // 前日のアラームが解決していない場合、新しい日に継続させる
            const prevState = localStorage.getItem(`alarm_${this.todayKey}`);
            if (!prevState || !JSON.parse(prevState).solved) {
                this.saveState();
            }
        }

        if (!this.isAlarmSet || this.isAlarmActive) return false;

        const [alarmHours, alarmMinutes] = this.alarmTime.split(':').map(Number);
        
        return currentTime.getHours() === alarmHours && 
               currentTime.getMinutes() === alarmMinutes;
    }

    /**
     * アラームを開始
     */
    startAlarm() {
        if (!this.isAlarmActive) {
            this.isAlarmActive = true;
            this.alarmSound.play().catch(e => console.error("アラーム音声の再生に失敗:", e));
            document.body.classList.add('alarm-active');
            this.saveState();
        }
    }

    /**
     * アラームを停止（問題解決時のみ）
     * @param {boolean} solved - 問題が解決されたかどうか
     */
    stopAlarm(solved = false) {
        if (this.isAlarmActive) {
            this.isAlarmActive = false;
            this.alarmSound.pause();
            this.alarmSound.currentTime = 0;
            document.body.classList.remove('alarm-active');
            
            if (solved) {
                // 問題が解決された場合、解決済みフラグをセット
                const state = JSON.parse(localStorage.getItem(`alarm_${this.todayKey}`) || '{}');
                state.active = false;
                state.solved = true;
                localStorage.setItem(`alarm_${this.todayKey}`, JSON.stringify(state));
            } else {
                // ただのアラーム停止（解決せず）
                this.saveState();
            }
        }
    }

    /**
     * アラームをリセット
     */
    resetAlarm() {
        this.stopAlarm(true); // 解決済みとしてアラームを停止
        this.isAlarmSet = false;
        this.alarmTime = null;
        this.saveState();
    }

    /**
     * アラームがアクティブかどうかを返す
     * @returns {boolean} アラームがアクティブかどうか
     */
    isActive() {
        return this.isAlarmActive;
    }
    
    /**
     * 今日の問題が解決済みかどうかを確認
     * @returns {boolean} 問題が解決済みかどうか
     */
    isSolvedToday() {
        const state = localStorage.getItem(`alarm_${this.todayKey}`);
        return state ? JSON.parse(state).solved === true : false;
    }
}

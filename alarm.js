/**
 * アラーム制御を行うクラス
 */
class AlarmController {
    constructor() {
        this.alarmTime = null;
        this.isAlarmSet = false;
        this.isAlarmActive = false;
        this.alarmSound = document.getElementById('alarm-sound');
    }

    /**
     * アラームを設定
     * @param {string} timeString - HH:MM 形式の時刻文字列
     */
    setAlarm(timeString) {
        this.alarmTime = timeString;
        this.isAlarmSet = true;
        this.isAlarmActive = false;
        return true;
    }

    /**
     * アラーム時刻かどうかをチェック
     * @param {Date} currentTime - 現在時刻
     * @returns {boolean} アラーム時刻かどうか
     */
    checkAlarm(currentTime) {
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
        }
    }

    /**
     * アラームを停止
     */
    stopAlarm() {
        if (this.isAlarmActive) {
            this.isAlarmActive = false;
            this.alarmSound.pause();
            this.alarmSound.currentTime = 0;
            document.body.classList.remove('alarm-active');
        }
    }

    /**
     * アラームをリセット
     */
    resetAlarm() {
        this.stopAlarm();
        this.isAlarmSet = false;
        this.alarmTime = null;
    }

    /**
     * アラームがアクティブかどうかを返す
     * @returns {boolean} アラームがアクティブかどうか
     */
    isActive() {
        return this.isAlarmActive;
    }
}

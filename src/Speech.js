(function() {
  var Speech;

  Speech = {
    startTimestamp: null,
    recognizing: false,
    recording: false,
    recognition: null,
    ignoreEnd: null,
    transcript: null,
    messages: {
      info_speak_now: 'Speak now.',
      info_no_speech: 'No speech was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.',
      info_no_mic: 'No microphone was found. Ensure that a microphone is installed and that',
      info_blocked: 'Permission to use microphone is blocked. To change, go to chrome://settings/contentExceptions#media-stream',
      info_denied: 'Permission to use microphone was denied.',
      info_start: 'Click on the microphone icon and begin speaking for as long as you like.',
      info_upgrade: 'Web Speech API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome">Chrome</a> version 25 or later.',
      info_allow: 'Click the "Allow" button above to enable your microphone.'
    },
    model: {
      icon: null,
      status: null,
      message: null,
      results: null
    },
    elements: {
      icon: angular.element('.speech-icon'),
      btn: angular.element('.speech-btn'),
      container: angular.element('.speech-container'),
      hint: angular.element('.speech-hint'),
      status: angular.element('.speech-status'),
      message: angular.element('.speech-message')
    },
    icons: {
      start: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic.gif',
      recording: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic-animate.gif',
      blocked: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic-slash.gif'
    },
    init: function() {
      this.log('Speech.init()', this);
      if ('webkitSpeechRecognition' in window) {
        this.setup();
      } else {
        this.showUpgrade();
      }
      this.model.message = this.messages.info_start;
      this.model.icon = this.icons.start;
      return this;
    },
    onstart: function(event) {
      Speech.log('Speech.onstart()', event);
      Speech.recognizing = true;
      Speech.showInfo('info_speak_now');
      return Speech.model.icon = Speech.icons.recording;
    },
    onerror: function(event) {
      Speech.log('Speech.onerror()', event);
      if (event.error === 'no-speech') {
        Speech.model.icon = Speech.icons.start;
        Speech.showInfo('info_no_speech');
        Speech.ignoreEnd = true;
      }
      if (event.error === 'audio-capture') {
        Speech.model.icon = Speech.icons.start;
        Speech.showInfo('info_no_microphone');
        Speech.ignoreEnd = true;
      }
      if (event.error === 'not-allowed') {
        if (event.timeStamp - Speech.startTimestamp < 100) {
          Speech.showInfo('info_blocked');
        } else {
          Speech.showInfo('info_denied');
        }
        return Speech.ignoreEnd = true;
      }
    },
    onend: function() {
      Speech.log('Speech.onend()');
      Speech.recognizing = false;
      if (Speech.ignoreEnd) {
        return;
      }
      Speech.model.icon = Speech.icons.start;
      if (!Speech.transcript) {
        Speech.showInfo('info_start');
        return;
      }
      return Speech.showInfo('');
    },
    onresult: function(event) {
      var i, interim_transcript;
      Speech.log('Speech.onresult()', event);
      Speech.recognizing = false;
      interim_transcript = '';
      if (typeof event.results === 'undefined') {
        this.recognition.onend = null;
        this.recognition.stop();
        Speech.showUpgrade();
        return;
      }
      i = event.resultIndex;
      while (i < event.results.length) {
        if (event.results[i].isFinal) {
          Speech.transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
        ++i;
      }
      Speech.transcript = Speech.capitalize(Speech.transcript);
      return Speech.transcript || interim_transcript;
    },
    showInfo: function(message) {
      this.log('Speech.showInfo()', this);
      return this.model.message = this.messages[message];
    },
    showUpgrade: function() {
      return this.log('Speech.showUpgrade()', this);
    },
    setup: function() {
      this.log('Speech.setup()', this);
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.onstart = this.onstart;
      this.recognition.onerror = this.onerror;
      this.recognition.onend = this.onend;
      return this.recognition.onresult = this.onresult;
    },
    start: function() {
      this.log('Speech.start()');
      if (this.recognizing) {
        this.recognition.stop();
        return;
      }
      this.recognizing = true;
      this.startTimestamp = new Date();
      return this.recognition.start();
    },
    stop: function() {
      return this.log('Speech.stop()');
    },
    capitalize: function(str) {},
    linebreak: function(s) {},
    log: function() {
      return console.log(arguments);
    }
  };

}).call(this);

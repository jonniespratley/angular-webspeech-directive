(function() {
  var j, jsSpeechFactory;

  jsSpeechFactory = (function() {
    var elements, icons, ignoreEnd, messages, model, recognition, recognizing, recording, startTimestamp, transcript;

    function jsSpeechFactory() {}

    startTimestamp = null;

    recognizing = false;

    recording = false;

    recognition = null;

    ignoreEnd = null;

    transcript = null;

    messages = {
      info_recording: 'Speak now.',
      info_no_jsSpeechFactory: 'No jsSpeechFactory was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892">microphone settings</a>.',
      info_no_mic: 'No microphone was found. Ensure that a microphone is installed and that',
      info_blocked: 'Permission to use microphone is blocked. To change, go to chrome://settings/contentExceptions#media-stream',
      info_denied: 'Permission to use microphone was denied.',
      info_start: 'Click on the microphone icon and begin speaking for as long as you like.',
      info_upgrade: 'Web jsSpeechFactory API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome">Chrome</a> version 25 or later.',
      info_allow: 'Click the "Allow" button above to enable your microphone.'
    };

    model = {
      icon: null,
      status: null,
      message: null,
      results: null
    };

    elements = icons = {
      start: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic.gif',
      recording: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic-animate.gif',
      blocked: 'https://dl.dropboxusercontent.com/u/26906414/cdn/img/mic-slash.gif'
    };

    jsSpeechFactory.prototype.init = function(scope) {
      this.scope = scope;
      this.log('jsSpeechFactory.init()', this);
      if ('webkitjsSpeechFactoryRecognition' in window) {
        this.setup();
      } else {
        this.showUpgrade();
      }
      model.message = messages.info_start;
      model.icon = icons.start;
      return scope;
    };

    jsSpeechFactory.prototype.onstart = function(event) {
      jsSpeechFactory.log('jsSpeechFactory.onstart()', event);
      jsSpeechFactory.recognizing = true;
      jsSpeechFactory.showInfo('info_speak_now');
      return jsSpeechFactory.model.icon = jsSpeechFactory.icons.recording;
    };

    jsSpeechFactory.prototype.onerror = function(event) {
      jsSpeechFactory.log('jsSpeechFactory.onerror()', event);
      if (event.error === 'no-jsSpeechFactory') {
        model.icon = icons.start;
        showInfo('info_no_jsSpeechFactory');
        ignoreEnd = true;
      }
      if (event.error === 'audio-capture') {
        model.icon = icons.start;
        showInfo('info_no_microphone');
        ignoreEnd = true;
      }
      if (event.error === 'not-allowed') {
        if (event.timeStamp - startTimestamp < 100) {
          showInfo('info_blocked');
        } else {
          showInfo('info_denied');
        }
        return ignoreEnd = true;
      }
    };

    jsSpeechFactory.prototype.onend = function() {
      this.log('jsSpeechFactory.onend()');
      recognizing = false;
      if (ignoreEnd) {
        return;
      }
      model.icon = icons.start;
      if (!transcript) {
        showInfo('info_start');
        return;
      }
      return showInfo('');
    };

    jsSpeechFactory.prototype.onresult = function(event) {
      var i, interim_transcript;
      this.log('jsSpeechFactory.onresult()', event);
      recognizing = false;
      interim_transcript = '';
      if (typeof event.results === 'undefined') {
        this.recognition.onend = null;
        this.recognition.stop();
        showUpgrade();
        return;
      }
      i = event.resultIndex;
      while (i < event.results.length) {
        console.log(event.results[i][0].transcript);
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
          this.stop();
        } else {
          transcript += event.results[i][0].transcript;
        }
        ++i;
      }
      return transcript = capitalize(jsSpeechFactory.transcript);
    };

    jsSpeechFactory.prototype.showInfo = function(message) {
      jsSpeechFactory.log('jsSpeechFactory.showInfo()', this);
      return this.message = this.messages[message];
    };

    jsSpeechFactory.prototype.showUpgrade = function() {
      return this.log('jsSpeechFactory.showUpgrade()', this);
    };

    jsSpeechFactory.prototype.setup = function() {
      this.log('jsSpeechFactory.setup()', this);
      this.recognition = new webkitjsSpeechFactoryRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.onstart = this.onstart;
      this.recognition.onerror = this.onerror;
      this.recognition.onend = this.onend;
      return this.recognition.onresult = this.onresult;
    };

    jsSpeechFactory.prototype.start = function() {
      this.log('jsSpeechFactory.start()');
      this.showInfo('info_recording');
      this.recognizing = true;
      this.model.icon = this.icons.recording;
      this.startTimestamp = new Date();
      return this.recognition.start();
    };

    jsSpeechFactory.prototype.toggle = function() {
      if (this.recognizing) {
        return this.stop();
      } else {
        return this.start();
      }
    };

    jsSpeechFactory.prototype.stop = function() {
      this.log('jsSpeechFactory.stop()');
      this.recognition.stop();
      this.model.icon = this.icons.end;
      return this.model.message = this.showInfo('info_start');
    };

    jsSpeechFactory.prototype.capitalize = function(s) {
      this.log(s);
      return s;
    };

    jsSpeechFactory.prototype.linebreak = function(s) {
      this.log(s);
      return s;
    };

    jsSpeechFactory.prototype.log = function() {
      return console.log(arguments);
    };

    return jsSpeechFactory;

  })();

  j = new jsSpeechFactory();

  j.init();

}).call(this);

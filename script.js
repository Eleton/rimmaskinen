var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var synth = window.speechSynthesis;

fetch("words.json")
.then(response => response.json())
.then(words => {
  console.log(words);

  var grammar = '#JSGF V1.0; grammar words; public <word> = ' + words.map(w => w.word).join(' | ') + ' ;'

  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;

  recognition.lang = "sv-SE";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;



  function speak(word){
    var voices = synth.getVoices();
    var voice = voices.find(v => v.lang === "sv-SE");

    if (synth.speaking) {
      console.error('speechSynthesis.speaking');
      return;
    }
    if (word !== '') {
      var utterThis = new SpeechSynthesisUtterance(word);
      console.log(utterThis)
      utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
      }
      utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
      }
      
      utterThis.voice = voice;
      utterThis.pitch = voice ? 2 : 1;
      synth.speak(utterThis);
    }
  }

  document.querySelector("#helga").onclick = () => {
    var voices = synth.getVoices();
    var voice = voices.find(v => v.lang === "sv-SE");

    var one = new SpeechSynthesisUtterance("åååååååå");
    one.voice = voice;
    one.pitch = 1;
    synth.speak(one);

    var two = new SpeechSynthesisUtterance("heeeeeeeel");
    two.voice = voice;
    two.pitch = 1.19;
    synth.speak(two);

    two = new SpeechSynthesisUtterance("ga naaaaaaaaatt");
    two.voice = voice;
    two.pitch = 1.33;
    synth.speak(two);


    two = new SpeechSynthesisUtterance("åååååååå");
    two.voice = voice;
    two.pitch = 1.06;
    synth.speak(two);
  }

  document.querySelector("#listen").onclick = () => {
    recognition.start();
    console.log("Lyssnar efter input!");
  }

  recognition.onresult = event => {
    console.log("Nu fick jag något!")
    var last = event.results.length - 1;
    console.log(last);
    console.log(event);
    var word = event.results[last][0].transcript;;
    console.log(word);
    var rhyme = words.find(w => w.word === word).rhyme;
    speak(rhyme);
  }

  recognition.onspeechend = function() {
    recognition.stop();
  }
})


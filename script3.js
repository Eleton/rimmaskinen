var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var synth = window.speechSynthesis;

var suggestionButton = document.querySelector("#suggest button");
var suggestions = document.querySelector("#suggestions");

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

  suggestionButton.onclick = () => {
    suggestions.innerHTML = "";
    var scrambled = words
      .map(w => ({ word: w.word, ran: Math.random() }))
      .sort((a, b) => a.ran > b.ran)
      .slice(0, 10)
      .map(w => w.word);
    console.log(scrambled);

    var list1 = document.createElement("ul");
    var list2 = document.createElement("ul");
    scrambled.forEach((w, i) => {
      var word = document.createElement("li");
      word.innerText = w;
      i < 5 ? list1.append(word) : list2.append(word);
    });
    suggestions.append(list1);
    suggestions.append(list2);
  }
})
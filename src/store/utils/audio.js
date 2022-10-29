import Sound from "react-native-sound";
let file = require('../../assets/audio/select.wav');


Sound.setCategory('Playback');

export const audio = () => {
  let whoosh = new Sound(file, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      return;
    }
  })
  whoosh.play(success => {
    if (success) {
      console.log('successfully finished playing');
    } else {
      console.log('playback failed due to audio decoding errors');
    }
  });



  // `../../assets/audio/${audio}`
}

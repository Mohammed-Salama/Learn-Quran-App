import React, { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { I18nManager } from "react-native";
import { useNavigation } from "@react-navigation/native";
// Main Components
import SurahHeader from "./SurahHeader";
import SurahText from "./SurahText";
import AudioPlayer from "./Audio/AudioPlayer";
// Data
import surasList from "../../Quran/surasList.json";
import juzInfo from "../../Quran/juzInfo.json";
// State
import { useSelector, useDispatch } from "react-redux";
import { SetCurrentSurahInd, CurrentSurahInd } from "../../Redux/slices/app";

import { CurrentJuzInd, JuzMode,
  JustEnteredNewSurah,
  JustEnteredNewSurahJuz,
  PlayBackChanged,
  SetPlayBackChanged
 } from "../../Redux/slices/app";
 import surasByWords from "../../Quran/surasByWords";

interface Props {
  audioList: any[];
}

const SurahPage: React.FC<Props> = ({audioList}) => {
  // RTL
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  // Basics
  const isWeb = Platform.OS === "web";
  const dispatch = useDispatch();
  const wrapDispatch = (setter: any) => (arg: any) => dispatch(setter(arg));
  const navigation = useNavigation();

  // States
  const [currentSurahInd, setCurrentSurahInd] = [
    useSelector(CurrentSurahInd),
    wrapDispatch(SetCurrentSurahInd),
  ];
  let currentSurahByWords = surasByWords[currentSurahInd];

  const juzMode = useSelector(JuzMode);
  const currentJuzInd = useSelector(CurrentJuzInd);
  const justEnteredNewSurah = useSelector(JustEnteredNewSurah);
  const justEnteredNewSurahJuz = useSelector(JustEnteredNewSurahJuz);
  // Set Surah Header
  React.useEffect(() => {
    const surahFontName = surasList[currentSurahInd].fontName;
    const surahFontFamily = surasList[currentSurahInd].fontFamily;
    navigation.setOptions(
      isWeb
        ? {
            headerTitle: () => (
              <SurahHeader
                title={surahFontName}
                fontFamily={surahFontFamily}
                navigation={navigation}
              />
            ),
          }
        : {
            headerTitle: () => (
              <SurahHeader
                title={surahFontName}
                fontFamily={surahFontFamily}
                navigation={navigation}
              />
            ),
          }
    );
  }, [navigation, currentSurahInd]);
  const [playBackChanged, setPlayBackChanged] = [
    useSelector(PlayBackChanged), wrapDispatch(SetPlayBackChanged)
  ]

  const [startWordIndForJuz, setStartWordIndForJuz] = React.useState(0);
  const [endWordIndForJuz, setEndWordIndForJuz] = React.useState(
    currentSurahByWords.words.length - 1
  );

  React.useEffect(() => {
    if (juzMode && currentJuzInd < 29 && currentJuzInd !== null) {
      let juz = juzInfo[currentJuzInd];
      let surahIndRelativeToJuz = juz?.juzSuras.indexOf(currentSurahInd);
      let startAyahIndForJuz = juz?.splits[surahIndRelativeToJuz][1];
      setStartWordIndForJuz(
        currentSurahByWords.firstWordsinAyah[startAyahIndForJuz] - 1
      );
      let endAyahIndForJuz = juz.splits[surahIndRelativeToJuz][0];
      setEndWordIndForJuz(
        currentSurahByWords.lastWordsinAyah[endAyahIndForJuz]
      );
    } else {
      setStartWordIndForJuz(0);
      setEndWordIndForJuz(currentSurahByWords.words.length - 1);
    }
  }, [justEnteredNewSurahJuz, justEnteredNewSurah, playBackChanged]);


  return (
    <>
          <SurahText
            currentSurahInd={currentSurahInd}
            startWordIndForJuz={startWordIndForJuz}
            endWordIndForJuz={endWordIndForJuz}
          />
      {!isWeb && <AudioPlayer audioList={audioList} />}
    </>
  );
};

export default SurahPage;

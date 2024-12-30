import { useEffect, useState } from "react";

interface Language {
  code: string;
  name: string;
}

const App = () => {
  const [inputText, setInputText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [sourceLang, setSourceLang] = useState<string>("en");
  const [targetLang, setTargetLang] = useState<string>("hi");
  const [loading, setLoading] = useState<boolean>(false);

  const languages: Language[] = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "zh", name: "Chinese" },
    { code: "de", name: "German" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
  ];

  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const translateText = async (): Promise<void> => {
    if (!inputText) {
      alert("Please enter text to translate.");
      return;
    }

    setTranslatedText("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          inputText
        )}&langpair=${sourceLang}|${targetLang}`
      );

      if (!response.ok) {
        throw new Error("Translation failed. Please try again.");
      }

      const data = await response.json();
      setTranslatedText(data.responseData.translatedText);
    } catch (error) {
      console.error("Error:", error);
      alert("Error translating text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const speak = (): void => {
    if (!translatedText) {
      alert("No text to speak. Please translate something first.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(translatedText);
    const voices = speechSynthesis.getVoices();

    const matchingVoice = voices.find((voice) =>
      voice.lang.toLowerCase().startsWith(targetLang.toLowerCase())
    );

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    } else {
      alert(`No voice available for the selected language: ${targetLang}`);
    }

    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white/20 backdrop-blur-lg p-6 shadow-xl rounded-3xl">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          🌐 Translate App
        </h1>

        <div className="mb-6">
          <label
            htmlFor="sourceLanguage"
            className="block text-lg font-semibold text-white mb-2"
          >
            Source Language:
          </label>
          <select
            id="sourceLanguage"
            value={sourceLang}
            onChange={(e) => {
              setSourceLang(e.target.value);
              if (e.target.value === targetLang) {
                setTargetLang(
                  languages.find((lang) => lang.code !== e.target.value)
                    ?.code || "en"
                );
              }
            }}
            className="w-full p-3 text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="targetLanguage"
            className="block text-lg font-semibold text-white mb-2"
          >
            Target Language:
          </label>
          <select
            id="targetLanguage"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full p-3 text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {languages
              .filter((lang) => lang.code !== sourceLang)
              .map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="inputText"
            className="block text-lg font-semibold text-white mb-2"
          >
            Enter Text:
          </label>
          <textarea
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type something to translate..."
            className="w-full p-3 h-32 text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
        </div>

        <button
          onClick={translateText}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-shadow shadow-lg hover:shadow-2xl active:scale-95"
        >
          {loading ? "Translating..." : "Translate"}
        </button>

        <div className="mt-6">
          {loading && (
            <div className="flex justify-center">
              <svg
                className="animate-spin h-8 w-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            </div>
          )}
          {translatedText && (
            <div className="mt-4 p-4 bg-white/80 text-gray-800 border border-gray-200 rounded-lg flex w-full">
              <img src="/speak.png" className="size-12 mr-2" onClick={speak} />
              <p className=" ">{translatedText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

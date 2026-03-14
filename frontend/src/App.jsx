import React, { useState, useEffect, useRef, useCallback } from 'react';
import { KEYBOARD_LAYOUTS } from './constants/layouts';
import { transliterate, getSuggestions } from './utils/transliteration';
import useVoiceToText from './hooks/useVoiceToText';
import './index.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [currentLang, setCurrentLang] = useState('Santali');
  // modes: 'phonetic', 'translate', 'off'
  const [typingMode, setTypingMode] = useState('phonetic');
  const [isTranslating, setIsTranslating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [theme, setTheme] = useState('studio'); // 'studio', 'midnight'
  const textareaRef = useRef(null);

  // Live translation via standalone backend (Railway)
  const translateSentence = useCallback(async (text) => {
    if (!text.trim()) return;
    setIsTranslating(true);
    try {
      let apiUrl = import.meta.env.VITE_API_URL || '';
      // Remove trailing slash if present to avoid double slashes
      if (apiUrl.endsWith('/')) apiUrl = apiUrl.slice(0, -1);
      
      const response = await fetch(`${apiUrl}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: text.trim(), 
          lang: currentLang
        })
      });
      const data = await response.json();
      if (data.translatedText) {
        setInputText(data.translatedText);
      }
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setIsTranslating(false);
    }
  }, [currentLang]);

  const themeClasses = {
    studio: {
      bg: 'bg-slate-50',
      text: 'text-slate-900',
      card: 'studio-card',
      key: 'key-studio',
      accent: 'bg-indigo-600',
      accentText: 'text-indigo-600',
      border: 'border-slate-200'
    },
    midnight: {
      bg: 'bg-slate-950',
      text: 'text-slate-100',
      card: 'midnight-card',
      key: 'bg-slate-900 border-slate-800 text-slate-200',
      accent: 'bg-indigo-500',
      accentText: 'text-indigo-400',
      border: 'border-slate-800'
    }
  };

  const currentTheme = themeClasses[theme];

  const { isRecording, error: voiceError, startRecording } = useVoiceToText((text) => {
    // For voice, we force transliteration to the target script
    const processedText = transliterate(text.toLowerCase(), currentLang);
    setInputText((prev) => prev + (prev.length > 0 ? ' ' : '') + processedText);
  }, 'en-IN');

  useEffect(() => {
    setSuggestions(getSuggestions(inputText.split(' ').pop(), currentLang, typingMode));
  }, [inputText, currentLang, typingMode]);

  const handleKeyPress = (char) => {
    setInputText((prev) => prev + char);
  };

  const handleBackspace = () => {
    setInputText((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setInputText('');
  };

  const currentLayout = KEYBOARD_LAYOUTS[currentLang];

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${currentTheme.text} transition-all duration-500 font-sans p-4 md:p-8`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation / Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${currentTheme.accent} rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg`}>
              T
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">TribalType</h1>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Script Workspace</p>
            </div>
          </div>
          
          <div className="flex gap-3 items-center">
            <div className={`flex bg-slate-200/50 dark:bg-slate-900 p-1 rounded-lg border ${currentTheme.border}`}>
              {['Santali', 'Manipuri'].map(lang => (
                <button 
                  key={lang}
                  onClick={() => setCurrentLang(lang)}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${currentLang === lang ? `${currentTheme.accent} text-white shadow-md` : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setTheme(theme === 'studio' ? 'midnight' : 'studio')}
              className={`p-1.5 rounded-lg border ${currentTheme.border} ${currentTheme.card} transition-all hover:scale-105 active:scale-95`}
              title="Toggle Theme"
            >
              {theme === 'studio' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
              )}
            </button>
          </div>
        </header>

        <main className="space-y-6">
          {/* Main Input Card */}
          <div className={`${currentTheme.card} rounded-2xl overflow-hidden relative border ${currentTheme.border}`}>
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => {
                const val = e.target.value;
                setInputText(val);

                // In TRANSLATE mode, just store the English text. Translation happens on Enter.
                if (typingMode === 'translate' || typingMode === 'off') return;

                // PHONETIC mode: transliterate character by character as the user types
                const selectionStart = e.target.selectionStart;
                const textBeforeCursor = val.slice(0, selectionStart);
                const textAfterCursor = val.slice(selectionStart);
                const lastSpaceIndex = textBeforeCursor.lastIndexOf(' ');
                const currentWord = textBeforeCursor.slice(lastSpaceIndex + 1);

                if (currentWord.length > 0 && val.length !== inputText.length) {
                  const lastTypedChar = val[selectionStart - 1];
                  if (lastTypedChar && lastTypedChar !== ' ') {
                    const scriptWord = transliterate(currentWord, currentLang);
                    if (scriptWord !== currentWord) {
                      const prefix = textBeforeCursor.slice(0, lastSpaceIndex + 1);
                      const newText = prefix + scriptWord + textAfterCursor;
                      setInputText(newText);
                      setTimeout(() => {
                        if (textareaRef.current) {
                          const newPos = prefix.length + scriptWord.length;
                          textareaRef.current.setSelectionRange(newPos, newPos);
                        }
                      }, 0);
                    }
                  }
                }
              }}
              onKeyDown={(e) => {
                // In TRANSLATE mode: press Enter to translate the typed sentence
                if (typingMode === 'translate' && e.key === 'Enter') {
                  e.preventDefault();
                  translateSentence(inputText);
                }
              }}
              placeholder={typingMode === 'translate' ? `Type English or ${currentLang} script, then press Enter...` : `Scribe starts here...`}
              className={`w-full h-40 p-6 text-2xl bg-transparent focus:ring-0 outline-none resize-none placeholder:text-slate-300 dark:placeholder:text-slate-700 leading-relaxed transition-all ${isTranslating ? 'opacity-50' : ''}`}
            />
            <div className="absolute top-2 right-2 flex gap-1">
              <button 
                onClick={() => navigator.clipboard.writeText(inputText)}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md text-slate-500 transition-colors"
                title="Copy All"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </button>
              <button 
                onClick={handleClear}
                className="p-1.5 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-md transition-colors"
                title="Clear Workspace"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>

          {/* Productivity Tools Bar */}
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2 items-center">
              <button 
                onClick={startRecording}
                disabled={isRecording}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white transition-all text-xs ${isRecording ? 'bg-red-500 animate-pulse' : `${currentTheme.accent} hover:opacity-90`}`}
              >
                {isRecording ? (
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="w-0.5 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
                  </div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 005.93 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-1.93v-2.07z" clipRule="evenodd" /></svg>
                )}
                <span>{isRecording ? 'Listening...' : 'Dictation'}</span>
              </button>
              
              <div className="flex bg-slate-200/50 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setTypingMode('off')}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${typingMode === 'off' ? `bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm` : `text-slate-400 hover:text-slate-600`}`}
                >
                  OFF
                </button>
                <button
                  onClick={() => setTypingMode('phonetic')}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-1.5 ${typingMode === 'phonetic' ? `bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-200/50` : `text-slate-400 hover:text-slate-600`}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${typingMode === 'phonetic' ? 'bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]' : 'bg-transparent'}`}></div>
                  PHONETIC
                </button>
                <button
                  onClick={() => setTypingMode('translate')}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-1.5 ${typingMode === 'translate' ? `bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 shadow-sm ring-1 ring-emerald-200/50` : `text-slate-400 hover:text-slate-600`}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${typingMode === 'translate' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-transparent'}`}></div>
                  TRANSLATE
                </button>
              </div>
            </div>

            <div className="flex gap-4 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold tracking-wider">
              <span className="text-slate-400">Chars: <span className={currentTheme.accentText}>{inputText.length}</span></span>
              <span className="text-slate-400">Script: <span className={currentTheme.accentText}>{currentLang}</span></span>
            </div>
          </div>

          {/* Translate button - only visible in TRANSLATE mode */}
          {typingMode === 'translate' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => translateSentence(inputText)}
                disabled={isTranslating}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all ${isTranslating ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 shadow-lg shadow-emerald-500/30'}`}
              >
                {isTranslating ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                )}
                {isTranslating ? 'Translating...' : 'Translate  (or press Enter)'}
              </button>

              <span className="text-[10px] text-slate-400 font-semibold">
                Bidirectional: Syncs automatically between English and {currentLang}
              </span>
            </div>
          )}

          {/* Voice Error Banner */}
          {voiceError && (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              <span className="flex-1">{voiceError}</span>
            </div>
          )}

          {/* Predictive Suggestions */}
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const parts = inputText.split(' ');
                  parts.pop();
                  const prefix = parts.join(' ');
                  setInputText(prefix + (prefix.length > 0 ? ' ' : '') + s + ' ');
                }}
                className={`suggestion-pill whitespace-nowrap text-sm shadow-md active:scale-95 ${idx === 0 ? 'ring-2 ring-indigo-300 dark:ring-indigo-600' : ''}`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Minimalist Keyboard */}
          <section className={`p-4 md:p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/50 border ${currentTheme.border}`}>
            <div className="flex flex-col gap-2">
              {currentLayout.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1.5">
                  {row.map((char, charIndex) => (
                    <button
                      key={charIndex}
                      onClick={() => handleKeyPress(char)}
                      className={`flex-1 min-w-[32px] max-w-[64px] h-12 md:h-14 rounded-lg flex items-center justify-center text-xl md:text-2xl font-bold transition-all ${theme === 'studio' ? 'key-studio' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 border-b-4 border-slate-950 active:translate-y-1 active:border-b-0'}`}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              ))}
              <div className="flex justify-center gap-2 mt-2">
                <button 
                  onClick={() => handleKeyPress(' ')}
                  className={`w-[60%] h-14 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all ${theme === 'studio' ? 'key-studio' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300 border-b-4 border-slate-950 active:translate-y-1 active:border-b-0'}`}
                >
                  SPACE
                </button>
                <button 
                  onClick={handleBackspace}
                  className={`w-[20%] h-14 rounded-lg flex items-center justify-center transition-all ${theme === 'studio' ? 'key-studio text-red-500' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-red-500 hover:text-white border-b-4 border-slate-950 active:translate-y-1 active:border-b-0'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414A2 2 0 0010.828 19H17a2 2 0 002-2V7a2 2 0 00-2-2h-6.172a2 2 0 00-1.414.586L3 12z" /></svg>
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Professional Footer */}
        <footer className="pt-8 pb-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center opacity-40 text-[9px] font-black uppercase tracking-widest">
          <span>Unicode Standard Workspace</span>
          <span>© 2026 TribalType</span>
        </footer>
      </div>
    </div>
  );
}

export default App;

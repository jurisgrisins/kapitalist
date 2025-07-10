import { useState, useEffect, useRef } from 'react';

interface Command {
  input: string;
  output: string[];
}

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const commands = {
    help: [
      'Available commands:',
      '  about      - Learn more about me',
      '  interests  - My interests and hobbies',
      '  links      - Useful links and projects',
      '  contact    - Get in touch with me',
      '  clear      - Clear the terminal',
      '  help       - Show this help message',
    ],
    about: [
      'Hello! Welcome to my personal space.',
      '',
      'I\'m a developer who loves clean code, terminal interfaces,',
      'and the elegance of command-line tools. This retro-style',
      'interface reflects my appreciation for minimalist design',
      'and efficient workflows.',
      '',
      'Feel free to explore using the commands below!',
    ],
    interests: [
      'My Interests & Hobbies:',
      '',
      '  • Programming & Software Development',
      '  • Open Source Projects',
      '  • Terminal Applications & CLI Tools',
      '  • Minimalist Design',
      '  • Technology & Innovation',
      '  • Learning New Technologies',
      '',
      'Always curious about new tools and methodologies!',
    ],
    links: [
      'Useful Links:',
      '',
      '  • GitHub: https://github.com/yourusername',
      '  • LinkedIn: https://linkedin.com/in/yourprofile',
      '  • Personal Blog: https://yourblog.com',
      '  • Portfolio: https://yourportfolio.com',
      '',
      'Check out my projects and connect with me!',
    ],
    contact: [
      'Get In Touch:',
      '',
      '  • Email: your.email@example.com',
      '  • Twitter: @yourusername',
      '  • Discord: yourusername#1234',
      '',
      'Always open to interesting conversations and collaborations!',
    ],
    clear: [],
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }

    const output = commands[trimmedCmd as keyof typeof commands] || [
      `Command not found: ${cmd}`,
      'Type "help" for available commands.',
    ];

    const newCommand: Command = {
      input: cmd,
      output,
    };

    setHistory(prev => [...prev, newCommand]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setCommandHistory(prev => [...prev, input]);
      setHistoryIndex(-1);
      executeCommand(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    // Show welcome message on mount
    const welcomeMessage: Command = {
      input: '',
      output: [
        'Welcome to my personal terminal!',
        '',
        'Type "help" to see available commands.',
        'Use arrow keys to navigate command history.',
        '',
      ],
    };
    setHistory([welcomeMessage]);
  }, []);

  useEffect(() => {
    // Focus input on mount and clicks
    const handleClick = () => {
      inputRef.current?.focus();
    };
    
    document.addEventListener('click', handleClick);
    inputRef.current?.focus();
    
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="min-h-screen p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-12 text-center">
          <img 
            src="/lovable-uploads/7c1f6926-efca-4071-a7d7-4a3fe43c37fd.png" 
            alt="KAPITALIST" 
            className="h-40 mx-auto"
          />
        </div>
        
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
          </div>
          <span className="text-sm text-muted-foreground ml-2">terminal@personal ~ %</span>
        </div>
        
        <div 
          ref={terminalRef}
          className="h-full overflow-y-auto space-y-2 text-sm font-mono"
        >
          {history.map((command, index) => (
            <div key={index}>
              {command.input && (
                <div className="flex items-center gap-2">
                  <span className="terminal-prompt">$</span>
                  <span className="terminal-output">{command.input}</span>
                </div>
              )}
              {command.output.map((line, lineIndex) => (
                <div key={lineIndex} className="terminal-output ml-4">
                  {line}
                </div>
              ))}
            </div>
          ))}
          
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="terminal-prompt">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-foreground font-mono"
              autoComplete="off"
              spellCheck="false"
            />
            <span className="terminal-cursor"></span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
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
      'Hello! I use this to explore and learn.',
      '',
      'This retro-style interface reflects my appreciation for',
      'minimalist design and efficient workflows.',
      '',
      'Feel free to explore using the commands below!',
    ],
    interests: [
      'My interests & hobbies:',
      '',
      '  • Photography',
      '  • Guitar',
      '  • Science-fiction',
      '  • Hikes in wilderness',
      '  • Investing',
      '  • Modern art (and NFTs)',
      '',
      'And curios about new tools and technologies!',
    ],
    links: [
      'Useful links:',
      '',
      '  • My book of the year: https://peterattiamd.com/outlive/',
      '  • Sci-fi of the year: https://www.goodreads.com/book/show/28768.Eden',
      '  • NFT portfolio: https://deca.art/HM9969/hm9969',
      '  • My Lightroom photos: http://bit.ly/44szQ0u',
      '',
      'Check out and connect with me!',
    ],
    contact: [
      'Get in touch:',
      '',
      '  • Email: mailto:j@kapitalist.xyz',
      '  • Twitter: https://twitter.com/HM_9969',
      '',
      'Open to new ideas!',
    ],
    clear: [],
  };

  const renderLineWithLinks = (line: string) => {
    const urlRegex = /(https?:\/\/[^\s]+|mailto:[^\s]+)/g;
    const parts = line.split(urlRegex);
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline transition-colors duration-200"
            style={{ textShadow: '0 0 5px #00ffff' }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
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
      <div className="w-full max-w-4xl mx-auto pt-16">
        {/* Logo */}
        <div className="mb-6">
          <img 
            src="/lovable-uploads/74713856-e177-4cdb-90b9-a0fdf57b8efa.png" 
            alt="KAPITALIST" 
            className="h-16 object-contain"
            style={{ objectPosition: 'left center' }}
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
                  {renderLineWithLinks(line)}
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
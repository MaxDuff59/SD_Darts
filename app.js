const { useState } = React;

// Liste des couleurs disponibles
const AVAILABLE_COLORS = [
  { color: '#FF6B6B', shadowColor: 'rgba(255, 107, 107, 0.6)' },
  { color: '#4ECDC4', shadowColor: 'rgba(78, 205, 196, 0.6)' },
  { color: '#FFE66D', shadowColor: 'rgba(255, 230, 109, 0.6)' },
  { color: '#95E1D3', shadowColor: 'rgba(149, 225, 211, 0.6)' },
  { color: '#F38181', shadowColor: 'rgba(243, 129, 129, 0.6)' },
  { color: '#AA96DA', shadowColor: 'rgba(170, 150, 218, 0.6)' },
  { color: '#FCBAD3', shadowColor: 'rgba(252, 186, 211, 0.6)' },
  { color: '#FFB6B9', shadowColor: 'rgba(255, 182, 185, 0.6)' },
  { color: '#8EC5FC', shadowColor: 'rgba(142, 197, 252, 0.6)' },
  { color: '#FEC8D8', shadowColor: 'rgba(254, 200, 216, 0.6)' },
];

// Liste des joueurs prédéfinies (sans couleur)
const PREDEFINED_PLAYERS = [
  { id: 1, name: 'Maxence' },
  { id: 2, name: 'Gabin' },
  { id: 3, name: 'Arnaud' },
  { id: 4, name: 'Louis' },
  { id: 5, name: 'Flavio' },
  { id: 6, name: 'Florian' },
];

// Fonction pour assigner des couleurs aléatoires
const assignRandomColors = (players) => {
  const shuffledColors = [...AVAILABLE_COLORS].sort(() => Math.random() - 0.5);
  return players.map((player, index) => ({
    ...player,
    color: shuffledColors[index].color,
    shadowColor: shuffledColors[index].shadowColor,
  }));
};

// Points sur la cible dans l'ordre horaire en partant du haut
const DART_NUMBERS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

// Types de zones
const ZONE_TYPES = {
  SINGLE_OUTER: 'single_outer',
  TRIPLE: 'triple',
  SINGLE_INNER: 'single_inner',
  DOUBLE: 'double',
  BULL_OUTER: 'bull_outer',
  BULL_INNER: 'bull_inner'
};

// Multiplicateurs de points
const ZONE_MULTIPLIERS = {
  [ZONE_TYPES.SINGLE_OUTER]: 1,
  [ZONE_TYPES.TRIPLE]: 3,
  [ZONE_TYPES.SINGLE_INNER]: 1,
  [ZONE_TYPES.DOUBLE]: 2,
  [ZONE_TYPES.BULL_OUTER]: 25,
  [ZONE_TYPES.BULL_INNER]: 50
};

// Écran d'accueil - Sélection du jeu
function HomeScreen({ onSelectGame }) {
  const games = [
    { id: 'zone', name: 'Zone', description: 'Capture les territoires', icon: '🎯', available: true },
    { id: '301', name: '301', description: 'Classique countdown', icon: '🔢', available: false },
    { id: 'cricket', name: 'Cricket', description: 'Ferme les numéros', icon: '🦗', available: false },
  ];

  return (
    <div style={styles.homeContainer}>
      <div style={styles.logoContainer}>
        <div style={styles.logoIcon}>🎯</div>
        <h1 style={styles.mainTitle}>DARTS</h1>
        <p style={styles.subtitle}>COMPANION</p>
      </div>
      
      <div style={styles.gamesGrid}>
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => game.available && onSelectGame(game.id)}
            style={{
              ...styles.gameCard,
              opacity: game.available ? 1 : 0.4,
              cursor: game.available ? 'pointer' : 'not-allowed',
            }}
          >
            <span style={styles.gameIcon}>{game.icon}</span>
            <span style={styles.gameName}>{game.name}</span>
            <span style={styles.gameDescription}>{game.description}</span>
            {!game.available && <span style={styles.comingSoon}>Bientôt</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// Écran de sélection des joueurs
function PlayerSelectScreen({ onStartGame, onBack }) {
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const togglePlayer = (player) => {
    if (selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
    } else if (selectedPlayers.length < 4) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const canStart = selectedPlayers.length >= 2;

  return (
    <div style={styles.selectContainer}>
      <button onClick={onBack} style={styles.backButton}>
        ← Retour
      </button>
      
      <h2 style={styles.selectTitle}>Choisis les joueurs</h2>
      <p style={styles.selectSubtitle}>2 à 4 joueurs • {selectedPlayers.length} sélectionné{selectedPlayers.length > 1 ? 's' : ''}</p>
      
      <div style={styles.playersGrid}>
        {PREDEFINED_PLAYERS.map((player) => {
          const isSelected = selectedPlayers.find(p => p.id === player.id);
          const selectionIndex = selectedPlayers.findIndex(p => p.id === player.id);
          
          const tempColor = AVAILABLE_COLORS[player.id % AVAILABLE_COLORS.length];
          
          return (
            <button
              key={player.id}
              onClick={() => togglePlayer(player)}
              style={{
                ...styles.playerCard,
                borderColor: isSelected ? tempColor.color : 'rgba(255,255,255,0.1)',
                boxShadow: isSelected ? `0 0 20px ${tempColor.shadowColor}` : 'none',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <div 
                style={{
                  ...styles.playerAvatar,
                  background: `linear-gradient(135deg, ${tempColor.color}, ${tempColor.color}88)`,
                }}
              >
                {player.name[0]}
              </div>
              <span style={styles.playerName}>{player.name}</span>
              {isSelected && (
                <span style={{...styles.playerOrder, backgroundColor: tempColor.color}}>
                  {selectionIndex + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      <button
        onClick={() => canStart && onStartGame(selectedPlayers)}
        style={{
          ...styles.startButton,
          opacity: canStart ? 1 : 0.4,
          cursor: canStart ? 'pointer' : 'not-allowed',
        }}
      >
        {canStart ? 'Commencer la partie !' : 'Sélectionne au moins 2 joueurs'}
      </button>
    </div>
  );
}

// Composant de la cible de fléchettes (VISUALISATION UNIQUEMENT)
function DartBoard({ zones }) {
  const centerX = 200;
  const centerY = 200;
  
  const radii = {
    bullInner: 12,
    bullOuter: 30,
    tripleInner: 95,
    tripleOuter: 107,
    doubleInner: 160,
    doubleOuter: 170,
    outer: 170,
  };

  const createSegment = (index, innerRadius, outerRadius, zoneType) => {
    const segmentAngle = 360 / 20;
    const startAngle = (index * segmentAngle - 99) * (Math.PI / 180);
    const endAngle = ((index + 1) * segmentAngle - 99) * (Math.PI / 180);
    
    const x1Inner = centerX + innerRadius * Math.cos(startAngle);
    const y1Inner = centerY + innerRadius * Math.sin(startAngle);
    const x2Inner = centerX + innerRadius * Math.cos(endAngle);
    const y2Inner = centerY + innerRadius * Math.sin(endAngle);
    
    const x1Outer = centerX + outerRadius * Math.cos(startAngle);
    const y1Outer = centerY + outerRadius * Math.sin(startAngle);
    const x2Outer = centerX + outerRadius * Math.cos(endAngle);
    const y2Outer = centerY + outerRadius * Math.sin(endAngle);
    
    const largeArc = segmentAngle > 180 ? 1 : 0;
    
    const d = `
      M ${x1Inner} ${y1Inner}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${x2Inner} ${y2Inner}
      L ${x2Outer} ${y2Outer}
      A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${x1Outer} ${y1Outer}
      Z
    `;
    
    return d;
  };

  const getBaseColor = (index, zoneType) => {
    const isEven = index % 2 === 0;
    if (zoneType === ZONE_TYPES.DOUBLE || zoneType === ZONE_TYPES.TRIPLE) {
      return isEven ? '#E74C3C' : '#27AE60';
    }
    return isEven ? '#1a1a2e' : '#F5DEB3';
  };

  const getZoneColor = (number, zoneType) => {
    const zoneKey = `${number}-${zoneType}`;
    const zone = zones[zoneKey];
    if (zone && zone.owner) {
      return zone.owner.color;
    }
    const index = DART_NUMBERS.indexOf(number);
    return getBaseColor(index, zoneType);
  };

  const renderSegment = (index, innerRadius, outerRadius, zoneType) => {
    const number = DART_NUMBERS[index];
    const zoneKey = `${number}-${zoneType}`;
    const zone = zones[zoneKey];
    const isOwned = zone && zone.owner;
    
    return (
      <path
        key={zoneKey}
        d={createSegment(index, innerRadius, outerRadius, zoneType)}
        fill={getZoneColor(number, zoneType)}
        stroke="#0f0f1a"
        strokeWidth="1"
        style={{
          transition: 'all 0.3s ease',
          filter: isOwned ? `drop-shadow(0 0 6px ${zone.owner.color})` : 'none',
        }}
      />
    );
  };

  const renderNumbers = () => {
    return DART_NUMBERS.map((num, index) => {
      const segmentAngle = 360 / 20;
      const angle = (index * segmentAngle - 90) * (Math.PI / 180);
      const radius = 188;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      return (
        <text
          key={`num-${num}`}
          x={x}
          y={y}
          fill="#ffffff"
          fontSize="14"
          fontWeight="bold"
          fontFamily="'Orbitron', monospace"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {num}
        </text>
      );
    });
  };

  return (
    <svg viewBox="0 0 400 400" style={styles.dartBoard}>
      <circle cx={centerX} cy={centerY} r={195} fill="#0a0a15" stroke="#333" strokeWidth="2" />
      
      {DART_NUMBERS.map((_, index) => 
        renderSegment(index, radii.tripleOuter, radii.doubleInner, ZONE_TYPES.SINGLE_OUTER)
      )}
      
      {DART_NUMBERS.map((_, index) => 
        renderSegment(index, radii.doubleInner, radii.doubleOuter, ZONE_TYPES.DOUBLE)
      )}
      
      {DART_NUMBERS.map((_, index) => 
        renderSegment(index, radii.tripleInner, radii.tripleOuter, ZONE_TYPES.TRIPLE)
      )}
      
      {DART_NUMBERS.map((_, index) => 
        renderSegment(index, radii.bullOuter, radii.tripleInner, ZONE_TYPES.SINGLE_INNER)
      )}
      
      <circle
        cx={centerX}
        cy={centerY}
        r={radii.bullOuter}
        fill={zones['bull-outer']?.owner ? zones['bull-outer'].owner.color : '#27AE60'}
        stroke="#0f0f1a"
        strokeWidth="1"
        style={{ 
          filter: zones['bull-outer']?.owner ? `drop-shadow(0 0 6px ${zones['bull-outer'].owner.color})` : 'none',
        }}
      />
      
      <circle
        cx={centerX}
        cy={centerY}
        r={radii.bullInner}
        fill={zones['bull-inner']?.owner ? zones['bull-inner'].owner.color : '#E74C3C'}
        stroke="#0f0f1a"
        strokeWidth="1"
        style={{ 
          filter: zones['bull-inner']?.owner ? `drop-shadow(0 0 6px ${zones['bull-inner'].owner.color})` : 'none',
        }}
      />
      
      {renderNumbers()}
    </svg>
  );
}

// Écran de jeu Zone
function ZoneGameScreen({ players, onEndGame }) {
  const MAX_ROUNDS = 10;
  const [zones, setZones] = useState({});
  const [scores, setScores] = useState(
    players.reduce((acc, player) => ({ ...acc, [player.id]: 0 }), {})
  );
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [throwsLeft, setThrowsLeft] = useState(3);
  const [playerRounds, setPlayerRounds] = useState(
    players.reduce((acc, player) => ({ ...acc, [player.id]: 1 }), {})
  );
  const [gameOver, setGameOver] = useState(false);
  const [history, setHistory] = useState([]);
  const [multiplier, setMultiplier] = useState('outer'); // outer, inner, double, triple

  const currentPlayer = players[currentPlayerIndex];

  const handleUndo = () => {
    if (history.length === 0) return;
    
    const lastState = history[history.length - 1];
    setZones(lastState.zones);
    setScores(lastState.scores);
    setCurrentPlayerIndex(lastState.currentPlayerIndex);
    setThrowsLeft(lastState.throwsLeft);
    setPlayerRounds(lastState.playerRounds);
    setHistory(history.slice(0, -1));
  };

  const handleNumberClick = (number) => {
    // Déterminer le type de zone basé sur le multiplicateur
    let zoneType;
    if (number === 25) {
      // Bull: outer = bull outer, double = bull inner (pas de triple ni inner)
      zoneType = multiplier === 'double' ? ZONE_TYPES.BULL_INNER : ZONE_TYPES.BULL_OUTER;
    } else {
      if (multiplier === 'triple') {
        zoneType = ZONE_TYPES.TRIPLE;
      } else if (multiplier === 'double') {
        zoneType = ZONE_TYPES.DOUBLE;
      } else if (multiplier === 'inner') {
        zoneType = ZONE_TYPES.SINGLE_INNER;
      } else {
        zoneType = ZONE_TYPES.SINGLE_OUTER;
      }
    }

    // Sauvegarder l'état actuel dans l'historique
    setHistory(prev => [...prev, {
      zones: { ...zones },
      scores: { ...scores },
      currentPlayerIndex,
      throwsLeft,
      playerRounds: { ...playerRounds },
    }]);

    const zoneKey = number === 25 
      ? (zoneType === ZONE_TYPES.BULL_INNER ? 'bull-inner' : 'bull-outer')
      : `${number}-${zoneType}`;
    
    const zone = zones[zoneKey];
    let newZones = { ...zones };
    let newScores = { ...scores };

    let points = 0;
    if (number === 25) {
      points = zoneType === ZONE_TYPES.BULL_INNER ? 50 : 25;
    } else {
      const mult = multiplier === 'triple' ? 3 : multiplier === 'double' ? 2 : 1;
      points = number * mult;
    }

    if (!zone || !zone.owner) {
      newZones[zoneKey] = { owner: currentPlayer };
      newScores[currentPlayer.id] += points;
    } else if (zone.owner.id === currentPlayer.id) {
      // Zone déjà possédée - rien ne change
    } else {
      newScores[zone.owner.id] -= points;
      newZones[zoneKey] = { owner: null };
    }

    setZones(newZones);
    setScores(newScores);

    const newThrowsLeft = throwsLeft - 1;
    if (newThrowsLeft === 0) {
      const newPlayerRounds = { ...playerRounds };
      newPlayerRounds[currentPlayer.id] = playerRounds[currentPlayer.id] + 1;
      
      let nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      let checkedPlayers = 0;
      
      while (newPlayerRounds[players[nextPlayerIndex].id] > MAX_ROUNDS && checkedPlayers < players.length) {
        nextPlayerIndex = (nextPlayerIndex + 1) % players.length;
        checkedPlayers++;
      }
      
      const allPlayersFinished = players.every(p => newPlayerRounds[p.id] > MAX_ROUNDS);
      
      if (allPlayersFinished) {
        setGameOver(true);
      } else {
        setCurrentPlayerIndex(nextPlayerIndex);
        setThrowsLeft(3);
      }
      
      setPlayerRounds(newPlayerRounds);
    } else {
      setThrowsLeft(newThrowsLeft);
    }
    
    // Reset multiplier to outer after each throw
    setMultiplier('outer');
  };

  const rankedPlayers = [...players].sort((a, b) => scores[b.id] - scores[a.id]);

  if (gameOver) {
    const winner = rankedPlayers[0];
    return (
      <div style={styles.gameOverContainer}>
        <div style={styles.gameOverContent}>
          <div style={styles.trophyIcon}>🏆</div>
          <h2 style={styles.gameOverTitle}>Partie terminée !</h2>
          <div style={{
            ...styles.winnerCard,
            borderColor: winner.color,
            boxShadow: `0 0 40px ${winner.shadowColor}`,
          }}>
            <div style={{
              ...styles.winnerAvatar,
              background: `linear-gradient(135deg, ${winner.color}, ${winner.color}88)`,
            }}>
              {winner.name[0]}
            </div>
            <span style={{ ...styles.winnerName, color: winner.color }}>{winner.name}</span>
            <span style={styles.winnerScore}>{scores[winner.id]} pts</span>
          </div>
          
          <div style={styles.finalRankings}>
            {rankedPlayers.map((player, index) => (
              <div key={player.id} style={styles.finalRankItem}>
                <span style={styles.finalRankPosition}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                </span>
                <span style={{ color: player.color, fontWeight: 'bold' }}>{player.name}</span>
                <span style={styles.finalRankScore}>{scores[player.id]} pts</span>
              </div>
            ))}
          </div>
          
          <button onClick={onEndGame} style={styles.newGameButton}>
            Nouvelle partie
          </button>
        </div>
      </div>
    );
  }

  // Numéros pour les boutons
  const row1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const row2 = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25];

  return (
    <div style={styles.gameContainer}>
      {/* Header compact */}
      <div style={styles.gameHeader}>
        <button onClick={onEndGame} style={styles.endGameButton}>✕</button>
        <div style={styles.currentPlayerDisplay}>
          <span style={{
            ...styles.currentPlayerName,
            color: currentPlayer.color,
          }}>
            {currentPlayer.name}
          </span>
          <div style={styles.throwsIndicator}>
            {[1, 2, 3].map(i => (
              <span
                key={i}
                style={{
                  ...styles.throwDot,
                  backgroundColor: i <= throwsLeft ? currentPlayer.color : '#333',
                }}
              />
            ))}
          </div>
        </div>
        <span style={styles.roundIndicator}>{playerRounds[currentPlayer.id]}/{MAX_ROUNDS}</span>
      </div>

      {/* Scores */}
      <div style={styles.scoresPanel}>
        {players.map((player) => (
          <div
            key={player.id}
            style={{
              ...styles.scoreCard,
              borderColor: player.id === currentPlayer.id ? player.color : 'transparent',
              boxShadow: player.id === currentPlayer.id ? `0 0 10px ${player.shadowColor}` : 'none',
            }}
          >
            <div
              style={{
                ...styles.scoreAvatar,
                background: `linear-gradient(135deg, ${player.color}, ${player.color}88)`,
              }}
            >
              {player.name[0]}
            </div>
            <span style={styles.scoreName}>{player.name}</span>
            <span style={{
              ...styles.scoreValue,
              color: player.color,
            }}>
              {scores[player.id]}
            </span>
          </div>
        ))}
      </div>

      {/* Cible (visualisation) */}
      <div style={styles.mainArea}>
        <div style={styles.dartBoardContainer}>
          <DartBoard zones={zones} />
        </div>
      </div>

      {/* Panneau de sélection */}
      <div style={styles.controlPanel}>
        {/* Sélecteur de multiplicateur */}
        <div style={styles.multiplierRow}>
          <button
            onClick={() => setMultiplier('outer')}
            style={{
              ...styles.multiplierButton,
              background: multiplier === 'outer' ? currentPlayer.color : 'rgba(255,255,255,0.1)',
              color: multiplier === 'outer' ? '#000' : '#fff',
            }}
          >
            Ext
          </button>
          <button
            onClick={() => setMultiplier('inner')}
            style={{
              ...styles.multiplierButton,
              background: multiplier === 'inner' ? currentPlayer.color : 'rgba(255,255,255,0.1)',
              color: multiplier === 'inner' ? '#000' : '#fff',
            }}
          >
            Int
          </button>
          <button
            onClick={() => setMultiplier('double')}
            style={{
              ...styles.multiplierButton,
              background: multiplier === 'double' ? currentPlayer.color : 'rgba(255,255,255,0.1)',
              color: multiplier === 'double' ? '#000' : '#fff',
            }}
          >
            Double
          </button>
          <button
            onClick={() => setMultiplier('triple')}
            style={{
              ...styles.multiplierButton,
              background: multiplier === 'triple' ? currentPlayer.color : 'rgba(255,255,255,0.1)',
              color: multiplier === 'triple' ? '#000' : '#fff',
            }}
          >
            Triple
          </button>
        </div>

        {/* Ligne 1: 1-10 */}
        <div style={styles.numberRow}>
          {row1.map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              style={styles.numberButton}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Ligne 2: 11-20 + 25 */}
        <div style={styles.numberRow}>
          {row2.map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              style={{
                ...styles.numberButton,
                ...(num === 25 ? styles.bullButton : {}),
              }}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Bouton Annuler */}
        <button 
          onClick={handleUndo} 
          style={{
            ...styles.undoButton,
            opacity: history.length > 0 ? 1 : 0.3,
          }}
          disabled={history.length === 0}
        >
          ↩ Annuler
        </button>
      </div>
    </div>
  );
}

// Application principale
function DartsApp() {
  const [screen, setScreen] = useState('home');
  const [selectedGame, setSelectedGame] = useState(null);
  const [players, setPlayers] = useState([]);

  const handleSelectGame = (gameId) => {
    setSelectedGame(gameId);
    setScreen('players');
  };

  const handleStartGame = (selectedPlayers) => {
    const playersWithColors = assignRandomColors(selectedPlayers);
    const shuffledPlayers = [...playersWithColors].sort(() => Math.random() - 0.5);
    setPlayers(shuffledPlayers);
    setScreen('game');
  };

  const handleEndGame = () => {
    setScreen('home');
    setSelectedGame(null);
    setPlayers([]);
  };

  return (
    <div style={styles.app}>
      {screen === 'home' && (
        <HomeScreen onSelectGame={handleSelectGame} />
      )}
      {screen === 'players' && (
        <PlayerSelectScreen
          onStartGame={handleStartGame}
          onBack={() => setScreen('home')}
        />
      )}
      {screen === 'game' && selectedGame === 'zone' && (
        <ZoneGameScreen
          players={players}
          onEndGame={handleEndGame}
        />
      )}
    </div>
  );
}

// Styles
const styles = {
  app: {
    height: '100vh',
    background: 'linear-gradient(135deg, #0a0a15 0%, #1a1a2e 50%, #0f0f1f 100%)',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: '#fff',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  
  // Home Screen
  homeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px',
    gap: '25px',
  },
  logoContainer: {
    textAlign: 'center',
  },
  logoIcon: {
    fontSize: '60px',
    marginBottom: '8px',
  },
  mainTitle: {
    fontSize: '36px',
    fontWeight: '900',
    letterSpacing: '8px',
    margin: '0',
    background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '14px',
    letterSpacing: '6px',
    color: '#888',
    margin: '5px 0 0 0',
  },
  gamesGrid: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gameCard: {
    background: 'rgba(255,255,255,0.05)',
    border: '2px solid rgba(255,255,255,0.1)',
    borderRadius: '15px',
    padding: '20px',
    width: '130px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  gameIcon: {
    fontSize: '32px',
  },
  gameName: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  gameDescription: {
    fontSize: '11px',
    color: '#888',
    textAlign: 'center',
  },
  comingSoon: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    fontSize: '9px',
    background: '#333',
    padding: '2px 6px',
    borderRadius: '8px',
  },

  // Player Select Screen
  selectContainer: {
    flex: 1,
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'auto',
  },
  backButton: {
    alignSelf: 'flex-start',
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '8px',
    marginBottom: '15px',
  },
  selectTitle: {
    fontSize: '22px',
    margin: '0',
  },
  selectSubtitle: {
    color: '#888',
    margin: '8px 0 20px 0',
    fontSize: '12px',
  },
  playersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    width: '100%',
    maxWidth: '360px',
  },
  playerCard: {
    background: 'rgba(255,255,255,0.05)',
    border: '2px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '15px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  playerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#000',
  },
  playerName: {
    fontSize: '12px',
    fontWeight: '500',
  },
  playerOrder: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#000',
  },
  startButton: {
    marginTop: '25px',
    padding: '14px 30px',
    fontSize: '16px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
    border: 'none',
    borderRadius: '25px',
    color: '#fff',
    transition: 'all 0.3s ease',
  },

  // Game Screen
  gameContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '8px',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  gameHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 0',
    flexShrink: 0,
  },
  endGameButton: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#888',
    fontSize: '14px',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  currentPlayerDisplay: {
    textAlign: 'center',
    flex: 1,
  },
  currentPlayerName: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  throwsIndicator: {
    display: 'flex',
    gap: '5px',
    justifyContent: 'center',
    marginTop: '4px',
  },
  throwDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  },
  roundIndicator: {
    fontSize: '14px',
    color: '#888',
    fontWeight: 'bold',
  },
  
  // Scores Panel - maintenant au-dessus de la cible
  scoresPanel: {
    display: 'flex',
    gap: '6px',
    padding: '5px 0',
    justifyContent: 'center',
    flexShrink: 0,
    marginBottom: '10px',
  },
  scoreCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    padding: '6px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    border: '2px solid transparent',
    transition: 'all 0.3s ease',
    minWidth: '65px',
  },
  scoreAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#000',
  },
  scoreName: {
    fontSize: '9px',
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: '15px',
    fontWeight: 'bold',
  },
  
  // Zone principale avec la cible
  mainArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 5px',
    marginBottom: '10px',
  },
  dartBoardContainer: {
    width: '220px',
    height: '220px',
  },
  dartBoard: {
    width: '100%',
    height: '100%',
  },
  
  // Panneau de contrôle
  controlPanel: {
    padding: '10px 5px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  multiplierRow: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
  },
  multiplierButton: {
    flex: 1,
    maxWidth: '80px',
    padding: '10px 5px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  numberRow: {
    display: 'flex',
    gap: '4px',
    justifyContent: 'center',
  },
  numberButton: {
    width: '32px',
    height: '38px',
    border: 'none',
    borderRadius: '6px',
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  bullButton: {
    background: '#E74C3C',
  },
  
  // Bouton Annuler
  undoButton: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#fff',
    fontSize: '13px',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '5px',
    alignSelf: 'center',
  },

  // Game Over Screen
  gameOverContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px',
  },
  gameOverContent: {
    textAlign: 'center',
    width: '100%',
  },
  trophyIcon: {
    fontSize: '60px',
    marginBottom: '8px',
  },
  gameOverTitle: {
    fontSize: '24px',
    margin: '0 0 20px 0',
    color: '#fff',
  },
  winnerCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '20px',
    border: '3px solid',
    marginBottom: '20px',
  },
  winnerAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#000',
    margin: '0 auto 12px auto',
  },
  winnerName: {
    fontSize: '22px',
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '5px',
  },
  winnerScore: {
    fontSize: '18px',
    color: '#888',
  },
  finalRankings: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '10px',
    padding: '12px',
    marginBottom: '20px',
  },
  finalRankItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 5px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  finalRankPosition: {
    width: '25px',
    fontSize: '14px',
  },
  finalRankScore: {
    color: '#888',
    fontSize: '13px',
  },
  newGameButton: {
    padding: '14px 40px',
    fontSize: '16px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
    border: 'none',
    borderRadius: '25px',
    color: '#fff',
    cursor: 'pointer',
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(<DartsApp />);
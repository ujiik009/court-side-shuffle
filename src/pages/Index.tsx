
import React, { useState, useEffect } from 'react';
import { Shuffle, Users, Plus, Trash2, Trophy, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Player {
  id: string;
  name: string;
  dateAdded: string;
}

interface Match {
  id: string;
  type: 'singles' | 'doubles';
  players: Player[];
  timestamp: string;
}

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [matchHistory, setMatchHistory] = useState<Match[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedPlayers = localStorage.getItem('badminton-players');
    const savedMatches = localStorage.getItem('badminton-matches');
    
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
    
    if (savedMatches) {
      setMatchHistory(JSON.parse(savedMatches));
    }
  }, []);

  // Save players to localStorage whenever players array changes
  useEffect(() => {
    localStorage.setItem('badminton-players', JSON.stringify(players));
  }, [players]);

  // Save match history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('badminton-matches', JSON.stringify(matchHistory));
  }, [matchHistory]);

  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      toast({
        title: "Oops! 🤔",
        description: "Please enter a player name",
        variant: "destructive"
      });
      return;
    }

    if (players.some(player => player.name.toLowerCase() === newPlayerName.toLowerCase())) {
      toast({
        title: "Already here! 😊",
        description: "This player is already in the game",
        variant: "destructive"
      });
      return;
    }

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName.trim(),
      dateAdded: new Date().toISOString()
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
    
    toast({
      title: "Welcome aboard! 🎉",
      description: `${newPlayer.name} joined the fun!`
    });
  };

  const removePlayer = (playerId: string) => {
    const playerToRemove = players.find(p => p.id === playerId);
    setPlayers(players.filter(player => player.id !== playerId));
    
    toast({
      title: "See you later! 👋",
      description: `${playerToRemove?.name} has left the game`
    });
  };

  const generateRandomMatch = (matchType: 'singles' | 'doubles') => {
    const requiredPlayers = matchType === 'singles' ? 2 : 4;
    
    if (players.length < requiredPlayers) {
      toast({
        title: "Need more friends! 👥",
        description: `You need at least ${requiredPlayers} players for ${matchType}`,
        variant: "destructive"
      });
      return;
    }

    // Shuffle players array and take required number
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const selectedPlayers = shuffledPlayers.slice(0, requiredPlayers);

    const match: Match = {
      id: Date.now().toString(),
      type: matchType,
      players: selectedPlayers,
      timestamp: new Date().toISOString()
    };

    setCurrentMatch(match);
    setMatchHistory([match, ...matchHistory]);

    toast({
      title: "Match time! 🏸✨",
      description: `${matchType.charAt(0).toUpperCase() + matchType.slice(1)} match is ready to play!`
    });
  };

  const clearAllPlayers = () => {
    setPlayers([]);
    setCurrentMatch(null);
    toast({
      title: "Fresh start! 🌟",
      description: "All players cleared - ready for new friends!"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">🏸</div>
      <div className="absolute top-20 right-20 text-4xl opacity-20 animate-pulse">⭐</div>
      <div className="absolute bottom-20 left-20 text-5xl opacity-20 animate-bounce delay-1000">🎯</div>
      <div className="absolute bottom-10 right-10 text-3xl opacity-20 animate-pulse delay-500">💫</div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-yellow-300 p-3 rounded-full shadow-lg animate-bounce">
              <Trophy className="w-8 h-8 text-yellow-800" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
              Badminton Buddy 🏸
            </h1>
            <div className="bg-yellow-300 p-3 rounded-full shadow-lg animate-bounce delay-300">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <p className="text-purple-600 text-xl font-medium">Let's create some magical matches! ✨</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Player Management */}
          <div className="space-y-6">
            {/* Add Player */}
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-orange-100 to-pink-100 transform hover:scale-105 transition-all duration-300 rounded-3xl">
              <CardHeader className="bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-t-3xl">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Plus className="w-6 h-6" />
                  </div>
                  Add New Friend 🌟
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter friend's name... 😊"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                    className="flex-1 rounded-2xl border-2 border-orange-200 focus:border-orange-400 h-12 text-lg bg-white/80"
                  />
                  <Button 
                    onClick={addPlayer} 
                    className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 rounded-2xl h-12 px-6 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Player List */}
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-green-100 to-teal-100 rounded-3xl">
              <CardHeader className="bg-gradient-to-r from-green-400 to-teal-400 text-white rounded-t-3xl">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="text-xl">Our Players ({players.length}) 👥</span>
                  </div>
                  {players.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllPlayers}
                      className="text-white border-white/50 hover:bg-white hover:text-green-600 rounded-2xl shadow-lg"
                    >
                      Clear All ✨
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {players.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎮</div>
                    <p className="text-gray-500 text-lg">No friends added yet!</p>
                    <p className="text-gray-400">Add some players to start the fun! 🎉</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {players.map((player, index) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-green-50 transition-all duration-200 shadow-md transform hover:scale-105 border-2 border-green-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-r from-green-400 to-teal-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                            {index + 1}
                          </div>
                          <span className="font-bold text-green-800 text-lg">{player.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePlayer(player.id)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full w-10 h-10 p-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Match Generation */}
          <div className="space-y-6">
            {/* Match Generation */}
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl">
              <CardHeader className="bg-gradient-to-r from-purple-400 to-blue-400 text-white rounded-t-3xl">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-white/20 p-2 rounded-full animate-spin-slow">
                    <Shuffle className="w-6 h-6" />
                  </div>
                  Magic Match Maker ✨
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button
                  onClick={() => generateRandomMatch('singles')}
                  disabled={players.length < 2}
                  className="w-full bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white py-4 text-lg font-bold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Shuffle className="w-5 h-5" />
                    <span>Singles Battle ⚔️</span>
                  </div>
                  <div className="text-sm opacity-90">(2 Players)</div>
                </Button>
                <Button
                  onClick={() => generateRandomMatch('doubles')}
                  disabled={players.length < 4}
                  className="w-full bg-gradient-to-r from-pink-400 to-red-500 hover:from-pink-500 hover:to-red-600 text-white py-4 text-lg font-bold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Shuffle className="w-5 h-5" />
                    <span>Doubles Team Up 🤝</span>
                  </div>
                  <div className="text-sm opacity-90">(4 Players)</div>
                </Button>
              </CardContent>
            </Card>

            {/* Current Match */}
            {currentMatch && (
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-yellow-100 to-orange-100 animate-in slide-in-from-right rounded-3xl">
                <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-t-3xl">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="bg-white/20 p-2 rounded-full animate-pulse">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <span>Current Match - {currentMatch.type.charAt(0).toUpperCase() + currentMatch.type.slice(1)} 🏆</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {currentMatch.type === 'singles' ? (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-6">
                        <div className="bg-gradient-to-br from-blue-200 to-blue-300 p-6 rounded-3xl shadow-lg transform hover:scale-105 transition-all duration-200">
                          <div className="text-3xl mb-2">🥊</div>
                          <p className="font-bold text-blue-800 text-lg">{currentMatch.players[0].name}</p>
                        </div>
                        <div className="text-4xl font-bold text-orange-600 animate-pulse">⚡VS⚡</div>
                        <div className="bg-gradient-to-br from-red-200 to-red-300 p-6 rounded-3xl shadow-lg transform hover:scale-105 transition-all duration-200">
                          <div className="text-3xl mb-2">🥊</div>
                          <p className="font-bold text-red-800 text-lg">{currentMatch.players[1].name}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-6">
                      <div className="bg-gradient-to-br from-blue-200 to-blue-300 p-6 rounded-3xl shadow-lg">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <Star className="w-6 h-6 text-blue-600" />
                          <h4 className="font-bold text-xl text-blue-800">Team Blue 💙</h4>
                          <Star className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-bold text-blue-700 text-lg">{currentMatch.players[0].name}</p>
                          <p className="font-bold text-blue-700 text-lg">{currentMatch.players[1].name}</p>
                        </div>
                      </div>
                      <div className="text-4xl font-bold text-orange-600 animate-pulse">⚡VS⚡</div>
                      <div className="bg-gradient-to-br from-red-200 to-red-300 p-6 rounded-3xl shadow-lg">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <Star className="w-6 h-6 text-red-600" />
                          <h4 className="font-bold text-xl text-red-800">Team Red ❤️</h4>
                          <Star className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-bold text-red-700 text-lg">{currentMatch.players[2].name}</p>
                          <p className="font-bold text-red-700 text-lg">{currentMatch.players[3].name}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-6 text-center bg-white/50 p-3 rounded-2xl">
                    <p className="text-sm text-gray-600 font-medium">
                      🕐 Generated: {new Date(currentMatch.timestamp).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Match History */}
            {matchHistory.length > 0 && (
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl">
                <CardHeader className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-t-3xl">
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Star className="w-6 h-6" />
                    </div>
                    Recent Adventures 📚
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {matchHistory.slice(0, 5).map((match, index) => (
                      <div key={match.id} className="bg-white p-4 rounded-2xl shadow-md border-2 border-indigo-200 hover:border-indigo-300 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="bg-indigo-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                              #{index + 1}
                            </span>
                            <span className="font-bold capitalize text-indigo-800">{match.type} 🏸</span>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {new Date(match.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 font-medium">
                          {match.players.map(p => p.name).join(' ⚡ ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

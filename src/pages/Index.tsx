
import React, { useState, useEffect } from 'react';
import { Shuffle, Users, Plus, Trash2, Trophy } from 'lucide-react';
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
        title: "Error",
        description: "Please enter a player name",
        variant: "destructive"
      });
      return;
    }

    if (players.some(player => player.name.toLowerCase() === newPlayerName.toLowerCase())) {
      toast({
        title: "Error",
        description: "Player already exists",
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
      title: "Success",
      description: `${newPlayer.name} added to the roster!`
    });
  };

  const removePlayer = (playerId: string) => {
    const playerToRemove = players.find(p => p.id === playerId);
    setPlayers(players.filter(player => player.id !== playerId));
    
    toast({
      title: "Player Removed",
      description: `${playerToRemove?.name} has been removed from the roster`
    });
  };

  const generateRandomMatch = (matchType: 'singles' | 'doubles') => {
    const requiredPlayers = matchType === 'singles' ? 2 : 4;
    
    if (players.length < requiredPlayers) {
      toast({
        title: "Not Enough Players",
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
      title: "Match Generated!",
      description: `${matchType.charAt(0).toUpperCase() + matchType.slice(1)} match ready to play!`
    });
  };

  const clearAllPlayers = () => {
    setPlayers([]);
    setCurrentMatch(null);
    toast({
      title: "All Players Cleared",
      description: "Player roster has been reset"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-green-600" />
            <h1 className="text-4xl font-bold text-green-800">Badminton Match Maker</h1>
            <Trophy className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-green-600 text-lg">Randomly match players for exciting badminton games!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Player Management */}
          <div className="space-y-6">
            {/* Add Player */}
            <Card className="shadow-lg border-green-200">
              <CardHeader className="bg-green-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Player
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter player name"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                    className="flex-1"
                  />
                  <Button onClick={addPlayer} className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Player List */}
            <Card className="shadow-lg border-green-200">
              <CardHeader className="bg-green-600 text-white">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Players ({players.length})
                  </div>
                  {players.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllPlayers}
                      className="text-white border-white hover:bg-white hover:text-green-600"
                    >
                      Clear All
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {players.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No players added yet. Add some players to start!</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {players.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <span className="font-medium text-green-800">{player.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePlayer(player.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
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
            <Card className="shadow-lg border-green-200">
              <CardHeader className="bg-green-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Shuffle className="w-5 h-5" />
                  Generate Match
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Button
                  onClick={() => generateRandomMatch('singles')}
                  disabled={players.length < 2}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Singles Match (2 Players)
                </Button>
                <Button
                  onClick={() => generateRandomMatch('doubles')}
                  disabled={players.length < 4}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Doubles Match (4 Players)
                </Button>
              </CardContent>
            </Card>

            {/* Current Match */}
            {currentMatch && (
              <Card className="shadow-lg border-green-200 animate-in slide-in-from-right">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Current Match - {currentMatch.type.charAt(0).toUpperCase() + currentMatch.type.slice(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {currentMatch.type === 'singles' ? (
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-100 p-4 rounded-lg">
                            <p className="font-bold text-blue-800">{currentMatch.players[0].name}</p>
                          </div>
                          <span className="text-2xl font-bold text-gray-600">VS</span>
                          <div className="bg-red-100 p-4 rounded-lg">
                            <p className="font-bold text-red-800">{currentMatch.players[1].name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mb-4">
                        <h4 className="font-bold text-lg mb-2 text-blue-800">Team 1</h4>
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <p className="font-medium">{currentMatch.players[0].name}</p>
                          <p className="font-medium">{currentMatch.players[1].name}</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-gray-600 block mb-4">VS</span>
                      <div>
                        <h4 className="font-bold text-lg mb-2 text-red-800">Team 2</h4>
                        <div className="bg-red-100 p-3 rounded-lg">
                          <p className="font-medium">{currentMatch.players[2].name}</p>
                          <p className="font-medium">{currentMatch.players[3].name}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      Generated: {new Date(currentMatch.timestamp).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Match History */}
            {matchHistory.length > 0 && (
              <Card className="shadow-lg border-green-200">
                <CardHeader className="bg-green-600 text-white">
                  <CardTitle>Recent Matches</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {matchHistory.slice(0, 5).map((match) => (
                      <div key={match.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">{match.type}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(match.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {match.players.map(p => p.name).join(' vs ')}
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

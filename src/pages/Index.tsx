
import React, { useState, useEffect } from 'react';
import { Shuffle, Users, Plus, Trash2, Trophy, Heart, Star, MapPin, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Player {
  id: string;
  name: string;
  groupId: string;
  dateAdded: string;
}

interface Group {
  id: string;
  name: string;
  color: string;
  dateCreated: string;
}

interface Court {
  id: string;
  name: string;
  isAvailable: boolean;
  dateCreated: string;
}

interface Match {
  id: string;
  type: 'singles' | 'doubles';
  players: Player[];
  groupId: string;
  courtId: string;
  timestamp: string;
}

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newCourtName, setNewCourtName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedCourt, setSelectedCourt] = useState<string>('');
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [matchHistory, setMatchHistory] = useState<Match[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedPlayers = localStorage.getItem('badminton-players');
    const savedGroups = localStorage.getItem('badminton-groups');
    const savedCourts = localStorage.getItem('badminton-courts');
    const savedMatches = localStorage.getItem('badminton-matches');
    
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
    
    if (savedGroups) {
      const loadedGroups = JSON.parse(savedGroups);
      setGroups(loadedGroups);
      if (loadedGroups.length > 0 && !selectedGroup) {
        setSelectedGroup(loadedGroups[0].id);
      }
    }
    
    if (savedCourts) {
      const loadedCourts = JSON.parse(savedCourts);
      setCourts(loadedCourts);
      if (loadedCourts.length > 0 && !selectedCourt) {
        setSelectedCourt(loadedCourts[0].id);
      }
    }
    
    if (savedMatches) {
      setMatchHistory(JSON.parse(savedMatches));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('badminton-players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('badminton-groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('badminton-courts', JSON.stringify(courts));
  }, [courts]);

  useEffect(() => {
    localStorage.setItem('badminton-matches', JSON.stringify(matchHistory));
  }, [matchHistory]);

  const addGroup = () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Oops! 🤔",
        description: "Please enter a group name",
        variant: "destructive"
      });
      return;
    }

    const colors = ['bg-blue-200', 'bg-green-200', 'bg-purple-200', 'bg-pink-200', 'bg-yellow-200', 'bg-indigo-200'];
    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName.trim(),
      color: colors[groups.length % colors.length],
      dateCreated: new Date().toISOString()
    };

    setGroups([...groups, newGroup]);
    setNewGroupName('');
    if (!selectedGroup) {
      setSelectedGroup(newGroup.id);
    }
    
    toast({
      title: "New group created! 🎉",
      description: `${newGroup.name} is ready for players!`
    });
  };

  const addCourt = () => {
    if (!newCourtName.trim()) {
      toast({
        title: "Oops! 🤔",
        description: "Please enter a court name",
        variant: "destructive"
      });
      return;
    }

    const newCourt: Court = {
      id: Date.now().toString(),
      name: newCourtName.trim(),
      isAvailable: true,
      dateCreated: new Date().toISOString()
    };

    setCourts([...courts, newCourt]);
    setNewCourtName('');
    if (!selectedCourt) {
      setSelectedCourt(newCourt.id);
    }
    
    toast({
      title: "New court added! 🏸",
      description: `${newCourt.name} is ready for matches!`
    });
  };

  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      toast({
        title: "Oops! 🤔",
        description: "Please enter a player name",
        variant: "destructive"
      });
      return;
    }

    if (!selectedGroup) {
      toast({
        title: "Select a group! 👥",
        description: "Please select or create a group first",
        variant: "destructive"
      });
      return;
    }

    if (players.some(player => player.name.toLowerCase() === newPlayerName.toLowerCase() && player.groupId === selectedGroup)) {
      toast({
        title: "Already here! 😊",
        description: "This player is already in this group",
        variant: "destructive"
      });
      return;
    }

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName.trim(),
      groupId: selectedGroup,
      dateAdded: new Date().toISOString()
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
    
    toast({
      title: "Welcome aboard! 🎉",
      description: `${newPlayer.name} joined the group!`
    });
  };

  const removePlayer = (playerId: string) => {
    const playerToRemove = players.find(p => p.id === playerId);
    setPlayers(players.filter(player => player.id !== playerId));
    
    toast({
      title: "See you later! 👋",
      description: `${playerToRemove?.name} has left the group`
    });
  };

  const removeGroup = (groupId: string) => {
    const groupToRemove = groups.find(g => g.id === groupId);
    const playersInGroup = players.filter(p => p.groupId === groupId);
    
    if (playersInGroup.length > 0) {
      toast({
        title: "Group has players! 👥",
        description: "Remove all players from this group first",
        variant: "destructive"
      });
      return;
    }

    setGroups(groups.filter(group => group.id !== groupId));
    if (selectedGroup === groupId) {
      setSelectedGroup(groups.length > 1 ? groups.find(g => g.id !== groupId)?.id || '' : '');
    }
    
    toast({
      title: "Group removed! ✨",
      description: `${groupToRemove?.name} has been deleted`
    });
  };

  const removeCourt = (courtId: string) => {
    const courtToRemove = courts.find(c => c.id === courtId);
    setCourts(courts.filter(court => court.id !== courtId));
    if (selectedCourt === courtId) {
      setSelectedCourt(courts.length > 1 ? courts.find(c => c.id !== courtId)?.id || '' : '');
    }
    
    toast({
      title: "Court removed! ✨",
      description: `${courtToRemove?.name} has been deleted`
    });
  };

  const generateRandomMatch = (matchType: 'singles' | 'doubles') => {
    if (!selectedGroup) {
      toast({
        title: "Select a group! 👥",
        description: "Please select a group first",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCourt) {
      toast({
        title: "Select a court! 🏸",
        description: "Please select or create a court first",
        variant: "destructive"
      });
      return;
    }

    const requiredPlayers = matchType === 'singles' ? 2 : 4;
    const groupPlayers = players.filter(p => p.groupId === selectedGroup);
    
    if (groupPlayers.length < requiredPlayers) {
      toast({
        title: "Need more friends! 👥",
        description: `You need at least ${requiredPlayers} players in this group for ${matchType}`,
        variant: "destructive"
      });
      return;
    }

    // Shuffle players array and take required number
    const shuffledPlayers = [...groupPlayers].sort(() => Math.random() - 0.5);
    const selectedPlayers = shuffledPlayers.slice(0, requiredPlayers);

    const match: Match = {
      id: Date.now().toString(),
      type: matchType,
      players: selectedPlayers,
      groupId: selectedGroup,
      courtId: selectedCourt,
      timestamp: new Date().toISOString()
    };

    setCurrentMatch(match);
    setMatchHistory([match, ...matchHistory]);

    const selectedCourtName = courts.find(c => c.id === selectedCourt)?.name;
    toast({
      title: "Match time! 🏸✨",
      description: `${matchType.charAt(0).toUpperCase() + matchType.slice(1)} match ready on ${selectedCourtName}!`
    });
  };

  const clearAllPlayers = () => {
    if (!selectedGroup) return;
    
    setPlayers(players.filter(p => p.groupId !== selectedGroup));
    setCurrentMatch(null);
    const groupName = groups.find(g => g.id === selectedGroup)?.name;
    toast({
      title: "Fresh start! 🌟",
      description: `All players cleared from ${groupName}!`
    });
  };

  const currentGroupPlayers = players.filter(p => p.groupId === selectedGroup);
  const currentGroup = groups.find(g => g.id === selectedGroup);
  const currentCourt = courts.find(c => c.id === selectedCourt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">🏸</div>
      <div className="absolute top-20 right-20 text-4xl opacity-20 animate-pulse">⭐</div>
      <div className="absolute bottom-20 left-20 text-5xl opacity-20 animate-bounce delay-1000">🎯</div>
      <div className="absolute bottom-10 right-10 text-3xl opacity-20 animate-pulse delay-500">💫</div>
      
      <div className="max-w-7xl mx-auto relative z-10">
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Group & Court Management */}
          <div className="space-y-6">
            {/* Groups Management */}
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl">
              <CardHeader className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-t-3xl">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Users className="w-6 h-6" />
                  </div>
                  Groups ({groups.length}) 👥
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="Group name... 🏷️"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addGroup()}
                    className="flex-1 rounded-2xl border-2 border-blue-200"
                  />
                  <Button onClick={addGroup} className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl">
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                
                {groups.length > 0 && (
                  <>
                    <Label>Select Active Group:</Label>
                    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                      <SelectTrigger className="rounded-2xl border-2 border-blue-200">
                        <SelectValue placeholder="Choose group..." />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${group.color}`}></div>
                              {group.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {groups.map((group) => (
                        <div key={group.id} className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-md">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${group.color}`}></div>
                            <span className="font-bold text-blue-800">{group.name}</span>
                            <span className="text-sm text-gray-500">({players.filter(p => p.groupId === group.id).length})</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeGroup(group.id)}
                            className="text-red-400 hover:text-red-600 rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Courts Management */}
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-teal-100 to-green-100 rounded-3xl">
              <CardHeader className="bg-gradient-to-r from-teal-400 to-green-400 text-white rounded-t-3xl">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="bg-white/20 p-2 rounded-full">
                    <MapPin className="w-6 h-6" />
                  </div>
                  Courts ({courts.length}) 🏸
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="Court name... 🏟️"
                    value={newCourtName}
                    onChange={(e) => setNewCourtName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCourt()}
                    className="flex-1 rounded-2xl border-2 border-teal-200"
                  />
                  <Button onClick={addCourt} className="bg-gradient-to-r from-teal-400 to-green-400 rounded-2xl">
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                
                {courts.length > 0 && (
                  <>
                    <Label>Select Court:</Label>
                    <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                      <SelectTrigger className="rounded-2xl border-2 border-teal-200">
                        <SelectValue placeholder="Choose court..." />
                      </SelectTrigger>
                      <SelectContent>
                        {courts.map((court) => (
                          <SelectItem key={court.id} value={court.id}>
                            🏸 {court.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {courts.map((court) => (
                        <div key={court.id} className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-md">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🏸</span>
                            <span className="font-bold text-teal-800">{court.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${court.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {court.isAvailable ? 'Available' : 'In Use'}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCourt(court.id)}
                            className="text-red-400 hover:text-red-600 rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Player Management */}
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
                <div className="space-y-4">
                  <div className="text-center">
                    {currentGroup && (
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className={`w-4 h-4 rounded-full ${currentGroup.color}`}></div>
                        <span className="text-lg font-bold text-orange-700">Adding to: {currentGroup.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter friend's name... 😊"
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                      className="flex-1 rounded-2xl border-2 border-orange-200 focus:border-orange-400 h-12 text-lg bg-white/80"
                      disabled={!selectedGroup}
                    />
                    <Button 
                      onClick={addPlayer} 
                      disabled={!selectedGroup}
                      className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 rounded-2xl h-12 px-6 shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
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
                    <span className="text-xl">Players ({currentGroupPlayers.length}) 👥</span>
                  </div>
                  {currentGroupPlayers.length > 0 && (
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
                {currentGroupPlayers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎮</div>
                    <p className="text-gray-500 text-lg">No friends in this group yet!</p>
                    <p className="text-gray-400">Add some players to start the fun! 🎉</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {currentGroupPlayers.map((player, index) => (
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
                {currentGroup && currentCourt && (
                  <div className="text-center bg-white/50 p-3 rounded-2xl mb-4">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div className={`w-3 h-3 rounded-full ${currentGroup.color}`}></div>
                      <span className="font-bold text-purple-700">{currentGroup.name}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">🏸</span>
                      <span className="font-bold text-blue-700">{currentCourt.name}</span>
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => generateRandomMatch('singles')}
                  disabled={currentGroupPlayers.length < 2 || !selectedGroup || !selectedCourt}
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
                  disabled={currentGroupPlayers.length < 4 || !selectedGroup || !selectedCourt}
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
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-lg">🏸</span>
                      <span className="font-bold text-orange-700">
                        {courts.find(c => c.id === currentMatch.courtId)?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${groups.find(g => g.id === currentMatch.groupId)?.color}`}></div>
                      <span className="font-bold text-yellow-700">
                        {groups.find(g => g.id === currentMatch.groupId)?.name}
                      </span>
                    </div>
                  </div>

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
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                              {courts.find(c => c.id === match.courtId)?.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {new Date(match.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 font-medium">
                          {match.players.map(p => p.name).join(' ⚡ ')}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className={`w-2 h-2 rounded-full ${groups.find(g => g.id === match.groupId)?.color}`}></div>
                          <span className="text-xs text-gray-500">
                            {groups.find(g => g.id === match.groupId)?.name}
                          </span>
                        </div>
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

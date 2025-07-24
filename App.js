// Fantasy11 Pro - React Native Version
import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';

export default function Fantasy11Pro() {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [results, setResults] = useState([]);

  const parsePlayers = (input) => {
    return input.split('\n').filter(Boolean).map(line => {
      const [name, rating] = line.split('-').map(s => s.trim());
      return { name, rating: parseInt(rating) || Math.floor(Math.random() * 41) + 60 };
    });
  };

  const calculateStrength = (team) => team.reduce((sum, p) => sum + p.rating, 0);

  const generateCombinations = (teamA, teamB, ratio) => {
    const [aCount, bCount] = ratio;
    const combinations = [];
    const shuffledA = [...teamA].sort(() => 0.5 - Math.random());
    const shuffledB = [...teamB].sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(1000, shuffledA.length - aCount + 1); i++) {
      const aSlice = shuffledA.slice(i, i + aCount);
      for (let j = 0; j < Math.min(1000, shuffledB.length - bCount + 1); j++) {
        const bSlice = shuffledB.slice(j, j + bCount);
        const team = [...aSlice, ...bSlice];
        const strength = calculateStrength(team);
        const sorted = [...team].sort((x, y) => y.rating - x.rating);
        const captain = sorted[0].name;
        const viceCaptain = sorted[1].name;
        const players = team.map(p => `${p.name} (${p.rating})`).join(', ');
        const text = `C: ${captain}\nVC: ${viceCaptain}\n${players}\nTotal: ${strength}`;
        const link = `https://wa.me/?text=${encodeURIComponent(text)}`;
        combinations.push({ ratio: `${aCount}-${bCount}`, captain, viceCaptain, players, strength, link });
        if (combinations.length >= 2000) return combinations;
      }
    }
    return combinations;
  };

  const generateTeams = () => {
    const aPlayers = parsePlayers(teamA);
    const bPlayers = parsePlayers(teamB);
    const ratios = [[3,8],[5,6],[7,4]];
    let allCombos = [];
    for (const ratio of ratios) {
      allCombos = allCombos.concat(generateCombinations(aPlayers, bPlayers, ratio));
      if (allCombos.length >= 8000) break;
    }
    setResults(allCombos.slice(0, 8000));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fantasy11 Pro</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Player A1 - 80\nPlayer A2 - 90"
        value={teamA}
        onChangeText={setTeamA}
      />
      <TextInput
        style={styles.input}
        multiline
        placeholder="Player B1 - 85\nPlayer B2 - 75"
        value={teamB}
        onChangeText={setTeamB}
      />
      <TouchableOpacity style={styles.button} onPress={generateTeams}>
        <Text style={styles.buttonText}>Generate Teams</Text>
      </TouchableOpacity>
      <Text style={styles.subheading}>Total Teams: {results.length}</Text>
      {results.map((r, i) => (
        <View key={i} style={styles.teamBox}>
          <Text style={styles.ratio}>Ratio: {r.ratio}</Text>
          <Text><Text style={styles.bold}>C:</Text> {r.captain} | <Text style={styles.bold}>VC:</Text> {r.viceCaptain}</Text>
          <Text>{r.players}</Text>
          <Text>Total Strength: {r.strength}</Text>
          <TouchableOpacity onPress={() => Linking.openURL(r.link)}>
            <Text style={styles.whatsapp}>Share on WhatsApp</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f0f2f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#007bff', marginBottom: 20 },
  input: { backgroundColor: '#fff', borderRadius: 5, padding: 10, marginBottom: 10, fontSize: 14, height: 100 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 5, marginBottom: 20 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  subheading: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  teamBox: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 2 },
  ratio: { fontWeight: 'bold', marginBottom: 5 },
  bold: { fontWeight: 'bold' },
  whatsapp: { color: 'green', marginTop: 8, textDecorationLine: 'underline' }
});

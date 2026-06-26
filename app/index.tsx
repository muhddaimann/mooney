import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="💰 Mooney" titleStyle={styles.title} />
        <Card.Content>
          <Text variant="bodyLarge" style={styles.text}>
            Manage your money with clarity, not complexity.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => alert('Welcome to Mooney!')}>
            Get Started
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1e293b',
    borderRadius: 12,
  },
  title: {
    color: '#f8fafc',
    fontWeight: 'bold',
  },
  text: {
    color: '#cbd5e1',
    marginVertical: 12,
  },
});

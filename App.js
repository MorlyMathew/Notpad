import React, { Component } from 'react';
import { View, TextInput, Button, Alert, Text, FlatList } from 'react-native';
import { AsyncStorage } from 'react-native';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: '',
      savedNotes: [],
    };
  }

  componentDidMount() {
    // Load saved notes from AsyncStorage when the component mounts
    this.loadNotes();
  }

  saveNote = async () => {
    try {
      // Save the note to AsyncStorage
      await AsyncStorage.setItem(`note_${Date.now()}`, this.state.note);
      Alert.alert('Note saved successfully!');
    // Clear the TextInput
    this.setState({ note: '' });
      // Reload notes after saving a new one
      this.loadNotes();
    
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  loadNotes = async () => {
    try {
      // Load all saved notes from AsyncStorage
      const savedNotes = await AsyncStorage.getAllKeys();
      if (savedNotes.length > 0) {
        // Retrieve the notes using AsyncStorage.multiGet
        const notes = await AsyncStorage.multiGet(savedNotes);
        // Update the state with the loaded notes
        this.setState({ savedNotes: notes });
     
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  renderNoteItem = ({ item }) => (
    <View style={{ marginVertical: 10,backgroundColor:'lightgray',padding:10,borderRadius:10 }}>
      <Text>{`${item.note}`}</Text>
      {/* <Button
        title="Delete Note"
        onPress={() => this.deleteNoteByKey(item.key)}
      /> */}
    </View>
  );

  deleteNoteByKey = async (key) => {
    try {
      // Remove the note from AsyncStorage using the key
      await AsyncStorage.removeItem(key);
      Alert.alert('Note deleted successfully!');
      // Reload notes after deleting one
      this.loadNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  render() {
    return (
      <View style ={{margin:20}}> 
        <TextInput
          multiline
          numberOfLines={4}
          placeholder="Enter your note here"
          value={this.state.note}
          onChangeText={(text) => this.setState({ note: text })}
        />
        <Button title="Save Note" onPress={this.saveNote} />
  
        <Text style = {{color:'black',fontWeight:'800',marginTop :10}}>Saved Notes :-</Text>
        <FlatList
          data={this.state.savedNotes.map(([key, note]) => ({ key, note }))}
          renderItem={this.renderNoteItem}
          keyExtractor={(item) => item.key}
        />
      </View>
    );
  }
}

export default App;

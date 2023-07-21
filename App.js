import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

export default function App() {
  const initialState = {
    id: 0,
    title: '',
    description: '',
    completed: false,
  };
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState(initialState);
  const [showModal, setShowModal] = useState(false);

  const getTodos = async () => {
    const storedTodos = await AsyncStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const clear = () => setNewTodo(initialState);

  const addTodo = () => {
    if (!newTodo.title || !newTodo.description) {
      alert('Please enter all the details.');
      return;
    }

    newTodo.id = todos.length + 1;
    const updatedTodos = [newTodo, ...todos];
    setTodos(updatedTodos);
    AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
    setShowModal(false);
    clear();
  };

  const updateTodo = (item) => {
    const updatedTodo = todos.map((todoItem) => {
      if (todoItem.id === item.id) {
        return {
          ...todoItem,
          completed: !todoItem.completed,
        };
      }
      return todoItem;
    });

    setTodos(updatedTodo);
    AsyncStorage.setItem('todos', JSON.stringify(updatedTodo));
  };

  const DisplayTodo = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => {
        Alert.alert(
          item.title,
          item.description,
          [
            {
              text: item.completed ? 'Mark In Progress' : 'Mark Completed',
              onPress: () => updateTodo(item),
            },
            {
              text: 'OK',
              style: 'cancel',
            },
          ]
        );
      }}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomColor: '#000',
        borderBottomWidth: 1,
      }}
    >
      <BouncyCheckbox
        isChecked={item.completed}
        fillColor="blue"
        onPress={() => updateTodo(item)}
      />
      <Text
        style={{
          color: '#000',
          fontSize: 16,
          width: '90%',
          textDecorationLine: item.completed ? 'line-through' : 'none',
        }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const handleChange = (title, value) =>
    setNewTodo({ ...newTodo, [title]: value });

  return (
    <View style={{ marginHorizontal: 20 }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 20,
        }}
      >
        <View>
          <Text style={{ color: '#000', fontSize: 34, fontWeight: 'bold' }}>
            Hello 👋
          </Text>
          <Text style={{ fontSize: 16 }}>
            {todos.length} {todos.length === 1 ? 'task' : 'tasks'} for you
          </Text>
        </View>
        <Image
          source={require('./assets/flowers.jpg')}
          style={{ height: 50, width: 50, borderRadius: 10 }}
        />
      </View>
      <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>
        TO DO 📄
      </Text>
      <ScrollView>
        <View style={{ height: 250 }}>
          {todos.map((item) =>
            !item.completed ? <DisplayTodo item={item}/> : null
          )}
        </View>
      </ScrollView>
      <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>
        Completed ✅
      </Text>
      <ScrollView>
        <View style={{ height: 250 }}>
          {todos.map((item) =>
            item.completed ? <DisplayTodo item={item}/> : null
          )}
        </View>
      </ScrollView>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'lightblue',
            borderRadius: 100,
            width: 60,
            height: 60,
          }}
        >
          <Text style={{ fontSize: 34, fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={{ marginHorizontal: 20 }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 20,
            }}
          >
            <View>
              <Text style={{ color: '#000', fontSize: 34, fontWeight: 'bold' }}>
                Hello 👋
              </Text>
              <Text style={{ fontSize: 16 }}>
                {todos.length} {todos.length === 1 ? 'task' : 'tasks'} for you
              </Text>
            </View>
            <Image
              source={require('./assets/flowers.jpg')}
              style={{ height: 50, width: 50, borderRadius: 10 }}
            />
          </View>
          <Text
            style={{
              marginVertical: 20,
              color: '#000',
              fontWeight: 'bold',
              fontSize: 25,
            }}
          >
            Add a Todo Item
          </Text>
          <TextInput
            placeholder="Title"
            value={newTodo.title}
            onChangeText={(title) => handleChange('title', title)}
            style={{
              backgroundColor: 'rgb(220,220,220)',
              borderRadius: 10,
              paddingHorizontal: 10,
              marginVertical: 10,
            }}
          />
          <TextInput
            placeholder="Description"
            value={newTodo.description}
            onChangeText={(desc) => handleChange('description', desc)}
            style={{
              backgroundColor: 'rgb(220,220,220)',
              borderRadius: 10,
              paddingHorizontal: 10,
              marginVertical: 10,
            }}
            multiline={true}
            numberOfLines={6}
          />
          <View style={{ width: '100%', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={addTodo}
              style={{
                backgroundColor: 'blue',
                width: 100,
                borderRadius: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 22 }}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

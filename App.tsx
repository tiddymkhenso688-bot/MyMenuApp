import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';

type DishType = 'Starter' | 'Main' | 'Dessert';

type Dish = {
  id: number;
  name: string;
  price: string;
  type: DishType;
  description: string;
};

type Screen = 'menu' | 'detail' | 'add' | 'edit';

const initialDishes: Dish[] = [
  { id: 1, name: 'Chicken Pops', price: '25', type: 'Starter', description: 'Fried small chicken balls' },
  { id: 2, name: 'Meat Balls', price: '30', type: 'Starter', description: 'Grilled beef meatballs' },
  { id: 3, name: 'Chicken Alfredo', price: '100', type: 'Main', description: 'Creamy chicken with noodles' },
  { id: 4, name: 'Grilled Chicken', price: '90', type: 'Main', description: 'Grilled chicken breast' },
  { id: 5, name: 'Vanilla Cake', price: '55', type: 'Dessert', description: 'Soft vanilla sponge cake' },
  { id: 6, name: 'Chocolate Munchkins', price: '50', type: 'Dessert', description: 'Chocolate donut holes' },
];

export default function App() {
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [screen, setScreen] = useState<Screen>('menu');
  const [selected, setSelected] = useState<Dish | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | DishType>('All');
  const [showDelete, setShowDelete] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<DishType>('Starter');
  const [desc, setDesc] = useState('');

  const filtered = dishes.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || d.type === filter;
    return matchesSearch && matchesFilter;
  });

  const openAdd = () => {
    setName(''); setPrice(''); setType('Starter'); setDesc('');
    setScreen('add');
  };

  const openEdit = (dish: Dish) => {
    setName(dish.name); setPrice(dish.price); setType(dish.type); setDesc(dish.description);
    setScreen('edit');
  };

  const saveNew = () => {
    if (!name.trim() || !price.trim()) { Alert.alert('Missing info', 'Please enter name and price'); return; }
    const newDish: Dish = { id: Date.now(), name: name.trim(), price: price.trim(), type, description: desc.trim() || 'No description' };
    setDishes([...dishes, newDish]);
    setScreen('menu');
  };

  const saveEdit = () => {
    if (!selected) return;
    if (!name.trim() || !price.trim()) { Alert.alert('Missing info', 'Please enter name and price'); return; }
    const updated = dishes.map(d => d.id === selected.id ? { ...d, name: name.trim(), price: price.trim(), type, description: desc.trim() } : d);
    setDishes(updated);
    setSelected({ ...selected, name: name.trim(), price: price.trim(), type, description: desc.trim() });
    setScreen('detail');
  };

  const confirmDelete = () => {
    if (!selected) return;
    setDishes(dishes.filter(d => d.id !== selected.id));
    setShowDelete(false);
    setScreen('menu');
  };

  // --- DELETE MODAL ---
  if (showDelete) {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalBox}>
          <View style={styles.questionCircle}><Text style={styles.questionMark}>?</Text></View>
          <Text style={styles.deleteTitle}>Delete Dish</Text>
          <Text style={styles.deleteText}>Are you sure, you want to delete?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.yesBtn} onPress={confirmDelete}><Text style={styles.btnText}>Yes delete</Text></TouchableOpacity>
            <TouchableOpacity style={styles.noBtn} onPress={() => setShowDelete(false)}><Text style={styles.btnTextDark}>No</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // --- MENU SCREEN ---
  if (screen === 'menu') {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>👨‍🍳</Text>
        <Text style={styles.title}>My Menu</Text>
        <TextInput style={styles.search} placeholder="Search dishes ..." placeholderTextColor="#b0c4de" value={search} onChangeText={setSearch} />
        <View style={styles.filterRow}>
          {(['All', 'Starter', 'Main', 'Dessert'] as const).map(f => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterBtn, filter === f && styles.filterActive]}>
              <Text style={styles.filterText}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView style={{ width: '50%' }}>
          {filtered.map(item => (
            <TouchableOpacity key={item.id} style={styles.card} onPress={() => { setSelected(item); setScreen('detail'); }}>
              <View>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardType}>{item.type}</Text>
              </View>
              <Text style={styles.cardPrice}>R {item.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.bottomRow}>
          <TouchableOpacity onPress={() => { setFilter('All'); setSearch(''); }} style={styles.clearBtn}><Text>Clear filter</Text></TouchableOpacity>
          <TouchableOpacity onPress={openAdd} style={styles.addBtn}><Text style={styles.addBtnText}>+ Add Dish</Text></TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- DETAIL SCREEN ---
  if (screen === 'detail' && selected) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setScreen('menu')}><Text style={styles.back}>← {selected.name}</Text></TouchableOpacity>
        <View style={styles.imageBox}><Text>Image</Text></View>
        <Text style={styles.detailRow}><Text style={styles.label}>Type:</Text>        {selected.type}</Text>
        <Text style={styles.detailRow}><Text style={styles.label}>Price:</Text>       R {selected.price}</Text>
        <Text style={styles.detailRow}><Text style={styles.label}>Description:</Text>  {selected.description}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.smallBtn} onPress={() => openEdit(selected)}><Text>Edit</Text></TouchableOpacity>
          <TouchableOpacity style={styles.smallBtn} onPress={() => setScreen('menu')}><Text>Back</Text></TouchableOpacity>
          <TouchableOpacity style={styles.smallBtn} onPress={() => setShowDelete(true)}><Text>Delete</Text></TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- ADD / EDIT SCREEN ---
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setScreen(screen === 'add' ? 'menu' : 'detail')}><Text style={styles.back}>← {screen === 'add' ? 'Add New Dish' : 'Edit dish'}</Text></TouchableOpacity>
      <View style={styles.formTop}>
        <View style={styles.imageSmall}><Text>Image</Text></View>
        <View style={{ flex: 1, gap: 10 }}>
          <TextInput style={styles.input} placeholder="Enter dish name" placeholderTextColor="#b0c4de" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Enter price" placeholderTextColor="#b0c4de" keyboardType="numeric" value={price} onChangeText={setPrice} />
        </View>
      </View>
      <Text style={styles.label}>Select Type</Text>
      <View style={styles.typeRow}>
        {(['Starter', 'Main', 'Dessert'] as DishType[]).map(t => (
          <TouchableOpacity key={t} onPress={() => setType(t)} style={[styles.typeBtn, type === t && styles.typeActive]}>
            <Text style={{ color: type === t ? '#000' : '#fff' }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Description</Text>
      <TextInput style={[styles.input, styles.descInput]} placeholder="Enter description" placeholderTextColor="#b0c4de" multiline value={desc} onChangeText={setDesc} />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveBtn} onPress={screen === 'add' ? saveNew : saveEdit}><Text>{screen === 'add' ? 'Save' : 'Update'}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => setScreen(screen === 'add' ? 'menu' : 'detail')}><Text>Cancel</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#5B8DB8', padding: 20, alignItems: 'center' },
  logo: { fontSize: 32, marginTop: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#E85A2E', marginVertical: 10 },
  search: { width: '100%', backgroundColor: '#4A7AA6', borderWidth: 1, borderColor: '#8FA8C8', borderRadius: 10, padding: 10, color: '#fff', marginBottom: 10 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#fff', borderRadius: 8 },
  filterActive: { backgroundColor: '#fff' },
  filterText: { color: '#fff', fontSize: 12 },
  card: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#5B8DB8', borderWidth: 1, borderColor: '#8FA8C8', borderRadius: 10, padding: 15, marginVertical: 6 },
  cardName: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cardType: { color: '#d0d8e6', fontSize: 12 },
  cardPrice: { color: '#fff', fontWeight: 'bold' },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 },
  clearBtn: { backgroundColor: '#E8E8E8', padding: 10, borderRadius: 20, paddingHorizontal: 16 },
  addBtn: { backgroundColor: '#C0C0C0', padding: 10, borderRadius: 20, paddingHorizontal: 20 },
  addBtnText: { fontWeight: 'bold' },
  back: { color: '#fff', fontWeight: 'bold', fontSize: 18, alignSelf: 'flex-start', marginBottom: 10 },
  imageBox: { width: '100%', height: 180, backgroundColor: '#F5F5DC', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginBottom: 20 },
  detailRow: { color: '#fff', alignSelf: 'flex-start', marginVertical: 6, fontSize: 16 },
  label: { color: '#fff', fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  smallBtn: { backgroundColor: '#C0C0C0', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 },
  formTop: { flexDirection: 'row', gap: 10, width: '100%', marginBottom: 15 },
  imageSmall: { width: 90, height: 90, backgroundColor: '#F5F5DC', justifyContent: 'center', alignItems: 'center' },
  input: { backgroundColor: '#4A7AA6', borderWidth: 1, borderColor: '#8FA8C8', borderRadius: 8, padding: 10, color: '#fff', width: '100%' },
  descInput: { height: 80, textAlignVertical: 'top' },
  typeRow: { flexDirection: 'row', gap: 8, width: '100%', marginVertical: 8 },
  typeBtn: { padding: 8, borderWidth: 1, borderColor: '#fff', borderRadius: 8 },
  typeActive: { backgroundColor: '#fff' },
  saveBtn: { backgroundColor: '#C0C0C0', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 20 },
  cancelBtn: { backgroundColor: '#fff', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 20 },
  modalContainer: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { width: '90%', borderWidth: 2, borderColor: '#000', padding: 20, alignItems: 'center', borderRadius: 8 },
  questionCircle: { width: 120, height: 80, borderWidth: 2, borderColor: '#000', borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  questionMark: { fontSize: 48, fontWeight: 'bold' },
  deleteTitle: { fontSize: 22, fontWeight: 'bold' },
  deleteText: { marginVertical: 10, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', gap: 15, marginTop: 10 },
  yesBtn: { borderWidth: 2, borderColor: '#000', padding: 14, borderRadius: 10 },
  noBtn: { borderWidth: 2, borderColor: '#000', padding: 14, borderRadius: 10, paddingHorizontal: 30 },
  btnText: { fontWeight: 'bold' },
  btnTextDark: { fontWeight: 'bold', fontSize: 16 },
});
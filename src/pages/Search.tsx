
import React, { useEffect, useState } from 'react';
import { View, StatusBar, StyleSheet, SafeAreaView, ActivityIndicator, FlatList, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Board } from '../features/board';
import AppbarTop from '../components/appbar-top';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import BoardData from '../types/BoardData';

const PAGE_SIZE = 10;

const SearchPage = () => {
  const [data, setData] = useState<BoardData[]>([]);
  const [filteredData, setFilteredData] = useState<BoardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<firebase.firestore.DocumentSnapshot | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true); 
  const [user, setUser] = useState<firebase.User | null>(null);
  const [searchText, setSearchText] = useState('');

  const fetchData = async (loadMore = false) => {
    if (loadMore && (loadingMore || !hasMore)) return;

    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const query = firebase.firestore().collection('publicboard')
        .orderBy('uploadDate', 'desc')
        .limit(PAGE_SIZE);

      let snapshot;
      if (loadMore && lastVisible) {
        snapshot = await query.startAfter(lastVisible).get();
      } else {
        snapshot = await query.get();
      }

      const newData = snapshot.docs.map((doc) => ({
        boardID: doc.id,
        ...doc.data(),
      })) as BoardData[];

      if (newData.length > 0) {
        setData(prevData => loadMore ? [...prevData, ...newData] : newData);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]); 
      }

      if (newData.length < PAGE_SIZE) {
        setHasMore(false);
      }

    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const filterData = () => {
    if (searchText.trim() === '') {
      setFilteredData([]);
      return;
    }

    const filtered = data.filter(item => {
      const lowerSearchText = searchText.toLowerCase();
      return item.title.toLowerCase().includes(lowerSearchText) ||
             item.description.toLowerCase().includes(lowerSearchText) ||
             item.tags.some(tag => tag.toLowerCase().includes(lowerSearchText));
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    filterData();
  }, [searchText, data]);

  useEffect(() => {
    const unsubscribeAuth = firebase.auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setData([]);
      setFilteredData([]);
      setLastVisible(null);
      setHasMore(true);
      fetchData(); 
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const renderItem = ({ item }: { item: BoardData }) => (
    <Board data={[item]} />
  );

  const renderFooter = () => {
    return loadingMore ? <ActivityIndicator size="large" color="#334155" /> : null;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <AppbarTop title="Effector Memory" canLogout={true} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          value={searchText}
          onChangeText={text => setSearchText(text)}
        />
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#334155" />
          ) : (
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item) => item.boardID}
              onEndReached={() => fetchData(true)} 
              onEndReachedThreshold={0.5} 
              ListFooterComponent={renderFooter} 
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  searchBar: {
    height: 50,
    margin: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default SearchPage;

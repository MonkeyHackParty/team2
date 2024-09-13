import React, { useState, useEffect } from 'react';
import { View, StatusBar, StyleSheet, SafeAreaView, ActivityIndicator, FlatList, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Board } from '../features/board';
import AppbarTopFolder from '../components/appbar-top-folder';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import BoardData from '../types/BoardData';

const PAGE_SIZE = 10;

const Folder = () => {
  const [data, setData] = useState<BoardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<firebase.firestore.DocumentSnapshot | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [index, setIndex] = useState(0);

  const fetchData = async (loadMore = false) => {
    if (loadMore && (loadingMore || !hasMore)) return;

    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      let query;

      if (index === 0) {
        query = firebase.firestore().collection(`users/${user.uid}/myboard`)
          .orderBy('uploadDate', 'desc')
          .limit(PAGE_SIZE);
      } else if (index === 1) {
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        const bookmarks = userDoc.data()?.bookmark || [];

        if (bookmarks.length === 0) {
          setHasMore(false);
          setLoading(false);
          return;
        }

        query = firebase.firestore().collection('publicboard')
          .where(firebase.firestore.FieldPath.documentId(), 'in', bookmarks)
          .orderBy('uploadDate', 'desc')
          .limit(PAGE_SIZE);
      } else {
        throw new Error('Invalid index');
      }

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

  useEffect(() => {
    const unsubscribeAuth = firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setData([]);
        setLastVisible(null);
        setHasMore(true);
      } else {
        setUser(null);
        setData([]);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (user) {
      setData([]);
      fetchData();
    }
  }, [index, user]);

  const renderItem = ({ item }: { item: BoardData }) => (
    <Board data={[item]} />
  );

  const renderFooter = () => {
    return loadingMore ? <ActivityIndicator size="large" color="#334155" /> : null;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <AppbarTopFolder title="Effecor Memory" index={index} setIndex={setIndex} />
        {user ? 
          <View style={styles.content}>
            {loading ? (
              <ActivityIndicator size="large" color="#334155" />
            ) : (
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.boardID}
                onEndReached={() => fetchData(true)}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
              />
            )}
          </View> :
          <View style={styles.centered}>
            <Text style={styles.message}>ログインしてください</Text>
          </View>
        }
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    marginTop: StatusBar.currentHeight,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    color: '#1e293b',
    textAlign: 'center',
  },
});

export default Folder;

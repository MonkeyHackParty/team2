import React, { useState, useEffect } from 'react';
import { View, StatusBar, StyleSheet, SafeAreaView, ActivityIndicator, FlatList, Text, Modal, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Board } from '../features/board';
import AppbarTopFolder from '../components/appbar-top-folder';
import BoardCreator from '../features/board-creator/components/board-creator';
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
  const [isModalVisible, setIsModalVisible] = useState(false);

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

      let newData: BoardData[] = [];

      if (index === 0) {
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        const myBoard = userDoc.data()?.myboard || [];

        if (myBoard.length === 0) {
          setHasMore(false);
          setLoading(false);
          return;
        }

        newData = myBoard.map((board: any) => ({
          boardID: board.boardID,
          ...board,
        })) as BoardData[];

        setData(loadMore ? [...data, ...newData] : newData);
        setHasMore(false); 

      } else if (index === 1) {
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        const bookmarks = userDoc.data()?.bookmark || [];

        if (bookmarks.length === 0) {
          setHasMore(false);
          setLoading(false);
          return;
        }

        const query = firebase.firestore().collection('publicboard')
          .where(firebase.firestore.FieldPath.documentId(), 'in', bookmarks)
          .orderBy('uploadDate', 'desc')
          .limit(PAGE_SIZE);

        let snapshot;
        if (loadMore && lastVisible) {
          snapshot = await query.startAfter(lastVisible).get();
        } else {
          snapshot = await query.get();
        }

        const fetchedData = snapshot.docs.map((doc) => ({
          boardID: doc.id,
          ...doc.data(),
        })) as BoardData[];

        if (fetchedData.length > 0) {
          setData(prevData => loadMore ? [...prevData, ...fetchedData] : fetchedData);
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        }

        if (fetchedData.length < PAGE_SIZE) {
          setHasMore(false);
        }

      } else {
        throw new Error('Invalid index');
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

  const handleNewBoardPress = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <AppbarTopFolder title="Effecor Memory" index={index} setIndex={setIndex} />
        {user ? 
          <View style={styles.content}>
            {index === 0 && (
              <Pressable style={styles.newBoardButton} onPress={handleNewBoardPress}>
                <Text style={styles.newBoardButtonText}>New Board</Text>
              </Pressable>
            )}
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
        <BoardCreator visible={isModalVisible} onClose={closeModal} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  newBoardButton: {
    backgroundColor: '#64748b',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  newBoardButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
});

export default Folder;

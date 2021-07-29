import React, {useEffect, useState} from 'react';
import {
  Text,
  FlatList,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import styles from './styles';
import {useReduxDispatch, useReduxSelector} from '../../redux';
import {
  fetchCharacters,
  fetchCharactersByName,
  SearchParams,
  saveFavorite,
  removeFavorite,
  fetchFavorites,
} from '../../redux/reducers/characters';
import {getThumbailFullPath, Character, Thumbnail} from '../../model/Character';

interface ModalState {
  character: Character;
  modalVisible: Boolean;
}
const PAGE_SIZE = 8;

const Characters = (): React.ReactElement => {
  const currentState = useReduxSelector(state => state.charactersReducer);
  const dispatch = useReduxDispatch();

  const initialModalState = {
    character: {
      id: 0,
      name: '',
      thumbnail: {path: '', extension: ''} as Thumbnail,
    },
    modalVisible: false,
  } as ModalState;
  const [modalState, setModalState] = useState(initialModalState);

  const [characterName, setCharacterName] = useState('');
  const searchParamsInitialState = {
    limit: PAGE_SIZE,
    offset: 0,
  } as SearchParams;
  const [searchParams, setSearchParams] = useState(searchParamsInitialState);

  function searchNextPage(): void {
    console.log('NEXT PAGE');
    dispatch(
      fetchCharacters({
        limit: PAGE_SIZE,
        offset: searchParams.offset + PAGE_SIZE,
      }),
    );
    setSearchParams({
      limit: PAGE_SIZE,
      offset: searchParams.offset + PAGE_SIZE,
    });
  }

  function searchFirstPage(): void {
    console.log('FIRST PAGE');
    dispatch(
      fetchCharacters({
        limit: PAGE_SIZE,
        offset: 0,
      }),
    );
    setSearchParams({
      limit: PAGE_SIZE,
      offset: 0,
    });
  }

  const DetailsModal = () => (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalState.modalVisible.valueOf()}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{modalState.character.name}</Text>

          <Text style={styles.modalText}>Eventos</Text>
          {modalState.character.events !== undefined &&
          modalState.character.events?.returned > 0 ? (
            <FlatList
              style={styles.mainList}
              data={modalState.character.events?.items}
              keyExtractor={item => {
                let random = Math.floor(Math.random() * 100) + 1;
                return String(`${item.name}_${random}`);
              }}
              renderItem={({item}) => (
                <View>
                  <Text>{item.name}</Text>
                </View>
              )}
            />
          ) : (
            <Text>Personagem não possui eventos</Text>
          )}
          <Text style={styles.modalText}>Series</Text>
          {modalState.character.series !== undefined &&
          modalState.character.series?.returned > 0 ? (
            <FlatList
              style={styles.mainList}
              data={modalState.character.series?.items}
              keyExtractor={item => {
                let random = Math.floor(Math.random() * 100) + 1;
                return String(`${item.name}_${random}`);
              }}
              renderItem={({item}) => (
                <View>
                  <Text>{item.name}</Text>
                </View>
              )}
            />
          ) : (
            <Text>Personagem não possui séries</Text>
          )}
          <Button
            title="Fechar"
            onPress={() => setModalState({...modalState, modalVisible: false})}
          />
        </View>
      </View>
    </Modal>
  );

  useEffect(() => {
    //searchFirstPage();
  }, [0]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <DetailsModal />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do personagem"
          keyboardType="default"
          value={characterName}
          onChangeText={text => {
            setCharacterName(text);
          }}
        />
        <Button
          disabled={currentState.loading === 'loading' ? true : false}
          title="Pesquisar"
          onPress={() => {
            if (characterName === '') {
              searchFirstPage();
            } else {
              dispatch(fetchCharactersByName(characterName));
            }
          }}
        />
        <View style={styles.favoriteSearchButton}>
          <Button
            disabled={currentState.loading === 'loading' ? true : false}
            title="Buscar favoritos"
            onPress={() => {
              dispatch(fetchFavorites());
            }}
          />
        </View>
      </View>
      <FlatList
        style={styles.mainList}
        data={currentState.characters}
        keyExtractor={item => {
          let ts = new Date().getTime();
          return String(`${item.id}_${ts}`);
        }}
        onEndReachedThreshold={0.1}
        onEndReached={() => {
          if (characterName === '' && currentState.searchType !== 'favorites') {
            searchNextPage();
          }
        }}
        renderItem={({item}) => (
          <View>
            <TouchableOpacity
              onPress={() =>
                setModalState({modalVisible: true, character: item})
              }>
              <Image
                source={{
                  uri: getThumbailFullPath(item.thumbnail),
                }}
                style={styles.characterImage}
              />
            </TouchableOpacity>
            <View style={styles.detailsContainer}>
              <Text style={styles.subtitle}>{item.name}</Text>
              {item.isFavorite ? (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(
                      removeFavorite({
                        id: item.id,
                        searchType: currentState.searchType,
                        name: characterName,
                        limit: searchParams.limit,
                        offset: searchParams.offset,
                      }),
                    );
                  }}>
                  <Image
                    style={styles.favoriteButton}
                    source={require('../../../resources/img/ic_action_favorited.png')}
                  />
                </TouchableOpacity>
              ) : null}
              {!item.isFavorite ? (
                <TouchableOpacity
                  onPress={() => {
                    dispatch(
                      saveFavorite({
                        id: item.id,
                        searchType: currentState.searchType,
                        name: characterName,
                        limit: searchParams.limit,
                        offset: searchParams.offset,
                      }),
                    );
                  }}>
                  <Image
                    style={styles.favoriteButton}
                    source={require('../../../resources/img/ic_action_favorite.png')}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}
      />
      {currentState.loading === 'loading' ? (
        <Text style={styles.loading}>Carregando ...</Text>
      ) : null}
      {currentState.error ? (
        <Text style={styles.loading}>{currentState.error}</Text>
      ) : null}
      {currentState.characters.length === 0 ? (
        <Text style={styles.loading}>
          Ops, não encontramos nenhum personagem com esse nome.
        </Text>
      ) : null}
    </>
  );
};
export default Characters;

import React, {useEffect} from "react";
import {Alert, Dimensions, Image, Text, View, TouchableOpacity} from "react-native";
import {useNavigation} from "react-navigation-hooks"
import {connect} from "react-redux";
import {fetchPicture} from "../../action-reducer/gif"
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview"
import {FONT_SIZE, LAYOUT_SPACING} from "../../styles/styles";
import Tags from "../../components/tag/Tags";
import LoadingView from "../pic/funnyPicsScreen";
import {GIFDETAIL, PICDETAIL} from "../../constants/routeConstants";

const {width, height} = Dimensions.get("window");

const dataProvider = new DataProvider((r1, r2) => {
  return r1.url !== r2.url;
});

const layoutProvider = new LayoutProvider(
  index => {
    return 0;
  },
  (type, dim) => {
    switch (type) {
      case 0:
        dim.width = width;
        dim.height = 32 + 12 + 24 + 30 + width;
        break;
    }
  }
);

function FunnyGifScreen(props) {
  const {navigate} = useNavigation();

  useEffect(() => {
    props.fetchPicture(props.page)
  }, []);

  const fetchMore = () => {
    if (props.gifList.length > 0 && !props.isFetching)
      props.fetchPicture(props.page)
  }

  const renderRow = (type, data) => {
    return (
      <View style={styles.item.container}>
        <Text style={styles.item.text}>{data.caption}</Text>
        <TouchableOpacity onPress={() => navigate(PICDETAIL, {data, gif: true})}>
          <Image
            source={{uri: data.url.replace(".jpg", ".gif")}}
            style={styles.item.image}
          />
        </TouchableOpacity>
        <Tags tags={data.tags} onTagPress={(item) => onTagPress(item)}/>
      </View>
    );
  }

  const renderFooter = () => {
    //Second view makes sure we don't unnecessarily change height of the list on this event. That might cause indicator to remain invisible
    //The empty view can be removed once you've fetched all the data
    return props.isFetching
      ? <LoadingView containerStyles={{margin: 10, height: 60}}/>
      : <View style={{height: 60}}/>;
  };

  const onTagPress = (item) => {
    Alert.alert(item)
  }

  return (
    <View style={styles.container}>
      <RecyclerListView
        forceNonDeterministicRendering={true}
        rowRenderer={renderRow}
        dataProvider={dataProvider.cloneWithRows(props.gifList)}
        layoutProvider={layoutProvider}
        onEndReachedThreshold={0.5}
        onEndReached={() => fetchMore()}
        renderFooter={renderFooter}
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1
  },
  item: {
    container: {
    },
    text: {
      color: "black",
      fontSize: FONT_SIZE.veryLarge,
      fontWeight: "bold",
      paddingHorizontal: LAYOUT_SPACING.normal,
      paddingBottom: LAYOUT_SPACING.normal
    },
    image: {
      width,
      height: width,
      resizeMode: "contain"
    }
  }
}

function mapStateToProps(state) {
  const {gif} = state;
  const {isFetching, error, gifList, page} = gif;
  return {
    isFetching,
    error,
    page,
    gifList
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPicture: (page) => dispatch(fetchPicture(page))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FunnyGifScreen)

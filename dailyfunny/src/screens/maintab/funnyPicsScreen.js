import React, {useEffect, useMemo} from "react";
import {Alert, Dimensions, Image, Text, View} from "react-native";
import {connect} from "react-redux";
import {loadPicture} from "../../action-reducer/picture"
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview"
import {LAYOUT_SPACING} from "../../styles/styles";
import Tags from "../../components/Tags";
import LoadingView from "../../components/loading/footerLoading"

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
        dim.height = width + LAYOUT_SPACING.actionBarHeight * 2;
        break;
    }
  }
);

function FunnyPicsScreen(props) {
  // const [page, setPage] = useState(1);
  // const [gifList, setPictureList] = useState(dataProvider);

  useEffect(() => {
    props.loadPicture(props.page)
  }, []);

  const fetchMore = () => {
    if (props.pictureList.length > 0 && (!props.isFetching))
      props.loadPicture(props.page)
  }

  const renderRow = (type, data) => {
    return (
      <View style={styles.item.container}>
        <Text style={styles.item.text}>{data.caption}</Text>
        <Image
          source={{uri: data.url}}
          style={styles.item.image}
        />
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
        dataProvider={dataProvider.cloneWithRows(props.pictureList)}
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
      paddingTop: LAYOUT_SPACING.large,
      alignSelf: "flex-start",
      height: "100%"
    },
    text: {
      color: "black",
      fontSize: 32,
      fontWeight: "bold",
      flexDirection: "row",
      flexWrap: "wrap",
      paddingLeft: LAYOUT_SPACING.large
    },
    image: {
      width,
      height: width,
      resizeMode: "contain"
    }
  }
}

function mapStateToProps(state) {
  const {picture} = state;
  const {isFetching, error, pictureList, page} = picture;
  return {
    isFetching,
    error,
    page,
    pictureList
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadPicture: (page) => dispatch(loadPicture(page))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FunnyPicsScreen)

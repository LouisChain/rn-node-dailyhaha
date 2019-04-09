import React, {useEffect} from "react";
import {Alert, Dimensions, Image, Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from "react-navigation-hooks"
import {connect} from "react-redux";
import {loadPicture, searchPicture} from "../../action-reducer/picture"
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview"
import {FONT_SIZE, LAYOUT_SPACING} from "../../styles/styles";
import Tags from "../../components/tag/Tags";
import LoadingView from "../../components/loading/footerLoading"
import {PICDETAIL} from "../../constants/routeConstants";
import FooterActions from "../../components/FooterActions"
import SearchPanel from "../../components/SearchPanel";
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob'
import DeviceInfo from 'react-native-device-info';

const {width} = Dimensions.get("window");

const imageHeight = width * 5 / 6;

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
        dim.height = 12 + 32 + 24 + 30 + 16 + 24 + imageHeight;
        break;
    }
  }
);

function FunnyPicsScreen(props) {
  const {navigate} = useNavigation();

  useEffect(() => {
    props.loadPicture(props.page)
  }, []);

  const fetchMore = () => {
    if (props.pictureList.length > 0 && (!props.isFetching))
      props.loadPicture(props.page)
  }

  const onTagPress = (item) => {
    props.onSearchTag(1, null, [item]);
  }

  const onComment = (data) => {
    Alert.alert("Under construction please be patient")
  }

  const onShare = (data) => {
    Alert.alert("Under construction please be patient")
  }

  const renderRow = (type, data) => {
    return (
      <View style={styles.item.container}>
        <Text numberOfLines={1} style={styles.item.text}>{data.caption}</Text>
        <Tags tags={data.tags} onTagPress={(item) => onTagPress(item)}/>
        <TouchableOpacity onPress={() => navigate(PICDETAIL, {data})}>
          <Image
            source={{uri: data.url}}
            style={styles.item.image}
          />
        </TouchableOpacity>
        <FooterActions {...data} onComment={() => onComment(data)} onShare={() => onShare(data)}/>
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
      <SearchPanel
        tags={["Animals", "Fail", "Weird", "Celebrity", "Cool", "Gross", "Cartoons", "Signs", "Costumes", "Illusions", "cant_park_there"]}
        table={"picture"}
      />
      <AdMobBanner
        style={{marginBottom: 50}}
        adSize="banner"
        adUnitID="ca-app-pub-2350916781050098/1822411774"
        testDevices={[DeviceInfo.getDeviceId()]}
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
      paddingTop: LAYOUT_SPACING.normal
    },
    text: {
      color: "black",
      fontSize: FONT_SIZE.veryLarge,
      fontWeight: "bold",
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: LAYOUT_SPACING.normal,
    },
    image: {
      width,
      height: imageHeight,
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
    loadPicture: (page) => dispatch(loadPicture(page)),
    onSearchTag: (page, e, tags) => dispatch(searchPicture(page, e, tags)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FunnyPicsScreen)

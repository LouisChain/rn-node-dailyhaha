import React, {useEffect, useState, useRef} from "react";
import {Alert, Dimensions, Image, Text, TouchableOpacity, View, RefreshControl} from "react-native";
import {AndroidBackHandler} from "react-navigation-backhandler"
import {useNavigation} from "react-navigation-hooks"
import {connect} from "react-redux";
import {fetchData, searchData} from "../../action-reducer/picture"
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview"
import {COLORS, FONT_SIZE, LAYOUT_SPACING} from "../../styles/styles";
import Tags from "../../components/tag/Tags";
import LoadingView from "../../components/loading/footerLoading"
import {PICDETAIL} from "../../constants/routeConstants";
import FooterActions from "../../components/FooterActions"
import SearchPanel from "../../components/SearchPanel";
import ErrorRetry from "../../components/error/ErrorRetry";
import FbAdBanner from "../../components/ads/FbAdBanner";
import {showInterstitial} from "../../utils/AdUtils";
import {FULL_ADS_PAGE_SHOWN} from "../../constants/common";

const {width} = Dimensions.get("window");

const imageHeight = width * 5 / 6;
const itemHeight = 12 + 32 + 24 + 30 + 16 + 24 + imageHeight;

const dataProvider = new DataProvider((r1, r2) => {
  return r1._id !== r2._id;
});

const layoutProvider = new LayoutProvider(
  index => {
    return 0;
  },
  (type, dim) => {
    switch (type) {
      case 0:
        dim.width = width;
        dim.height = itemHeight;
        break;
    }
  }
);
let smallestVisibleIndex = 0;

function FunnyPicsScreen(props) {
  const {navigate} = useNavigation();
  const newFeeds = useRef();
  const [refreshing, setRefreshing] = useState(false);
  const [searchState, setSearchState] = useState({searching: false, query: null, selectedTags: null});

  useEffect(() => {
    setRefreshing(props.isFetching);
  }, [props.isFetching])

  useEffect(() => {
    if (searchState.searching) {// switch from feed to search state then reset data to 1st page
      props.searchData(1, searchState.query, searchState.selectedTags, true);
    } else {// switch from search state to feed then reset data to 1st page
      props.fetchData(1, true)
    }
  }, [searchState]);

  const fetchMore = () => {
    if (props.page % FULL_ADS_PAGE_SHOWN === 0 && props.page !== 0) {
      showInterstitial();
    }
    if (props.data.length > 0 && !props.isFetching) {
      onRetry();
    }
  }

  const onTagPress = (item) => {
    setSearchState({
      searching: true,
      query: null,
      selectedTags: [item]
    })
  }

  const onRetry = () => {
    if (searchState.searching) {
      props.searchData(props.page, searchState.query, searchState.selectedTags, false);
    } else {
      props.fetchData(props.page, false)
    }
  }

  const onSearch = (searching, query, selectedTags) => {
    setSearchState({
      searching,
      query,
      selectedTags
    })
  }

  const onComment = (data) => {
    Alert.alert('', "Under construction please be patient")
  }

  const onShare = (data) => {
    Alert.alert('', "Under construction please be patient")
  }

  const onRefresh = () => {
    setRefreshing(true);
    props.fetchData(1, true);
  }

  const onBackButtonPressAndroid = () => {
    if (smallestVisibleIndex !== 0) {
      newFeeds.current.scrollToTop(true);
      onRefresh();
      return true;
    } else {
      return false;
    }
  };

  const onVisibleIndexesChanged = (all, now, notNow) => {
    if (all && all.length > 0) {
      smallestVisibleIndex = all[0];
    }
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
      <AndroidBackHandler style={styles.contain} onBackPress={onBackButtonPressAndroid}>
        {
          props.error ?
            <ErrorRetry errorMessage={props.error} onRetry={onRetry}/>
            :
            <RecyclerListView
              scrollViewProps={{
                refreshControl: (
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[COLORS.activeColor]}
                  />
                )
              }}
              ref={newFeeds}
              forceNonDeterministicRendering={true}
              rowRenderer={renderRow}
              dataProvider={dataProvider.cloneWithRows(props.data)}
              layoutProvider={layoutProvider}
              onEndReachedThreshold={0.5}
              onEndReached={() => fetchMore()}
              renderFooter={renderFooter}
              onVisibleIndexesChanged={onVisibleIndexesChanged}
            />
        }
        <SearchPanel
          tags={["Animals", "Fail", "Weird", "Celebrity", "Cool", "Gross", "Cartoons", "Signs", "Costumes", "Illusions", "cant_park_there"]}
          table={"picture"}
          onSearch={(a, b, c) => onSearch(a, b, c)}
        />
      </AndroidBackHandler>
      <FbAdBanner/>
    </View>
  );
}

const styles = {
  container: {
    flex: 1
  },
  ad: {
    height: itemHeight,
    paddingTop: LAYOUT_SPACING.normal
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
  const {isFetching, error, data, page, resetData} = picture;
  return {
    isFetching,
    error,
    page,
    data,
    resetData
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchData: (page, resetData) => dispatch(fetchData(page, resetData)),
    searchData: (page, query, tags, resetData) => dispatch(searchData(page, query, tags, resetData)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FunnyPicsScreen)

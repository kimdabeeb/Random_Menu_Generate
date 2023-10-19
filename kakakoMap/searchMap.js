'use strict';

// marker array
let markers = [];
// map container
let mapContainer = document.getElementById('map'),
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567),
        level: 3,
  };

let map = new kakao.maps.Map(mapContainer, mapOption);

/* user current location - Geolocation API s */
let marker = new kakao.maps.Marker({
    position: map.getCenter(),
});
marker.setMap(map);

kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
    let latlng = mouseEvent.latLng;
    marker.setPosition(latlng);
});

function curpos() {
    let curMarkers = [];
    let locIndex = 0;

    let curMarkerImageUtl = 'https://t1.daumcdn.net/localimg/localimages/07/2018/img/exsearch-ico-red8_hover.png',
        curMarkerImageSize = new kakao.maps.Size(20, 20),
        curMarkerImageOptions = {
            offset : new kakao.maps.Point(20, 20)
        };

    let curMarkerImage = new kakao.maps.MarkerImage(curMarkerImageUtl, curMarkerImageSize, curMarkerImageOptions);

    if (navigator.geolocation) {

        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation. watchPosition(function(position) {
    
            var lat = position.coords.latitude,  
                lon = position.coords.longitude; 
    
            var locPosition = new kakao.maps.LatLng(lat, lon);

            displayMarker(locPosition);
          });
} else {
    var locPosition = new kakao.maps.LatLng(lat, lon);
    displayMarker(locPosition);
}
        // 지도에 마커와 인포윈도우를 표시하는 함수입니다
        function displayMarker(locPosition) {

            // 마커를 생성합니다
            var curMarker = new kakao.maps.Marker({
                position: locPosition,
                image : curMarkerImage
            });
        
            //마커를 배열에 넣습니다
            curMarkers.push(curMarker);
        
            //배열에 넣은 마커를 생성하는 부분입니다
            if(curMarkers.length>=2)
            // 배열의 개수가 2개가 넘어가면 기존 배열의 마커를 지우고 배열값도 삭제합니다
            { curMarkers[curMarkers.length-2].setMap(null); curMarkers.shift();}
        
            //배열에 저장한 마커를 맵에 뛰웁니다
            curMarkers[curMarkers.length-1].setMap(map);
        
            // 지도 중심좌표를 접속위치로 변경합니다
            if(locIndex === 0){
              map.setCenter(locPosition);
              locIndex = 1;
            }
    }

    marker.setMap(null);
}
/*  Geolocation API e */

// Search list
let ps = new kakao.maps.services.Places();
// Search list/marker click, info output infowindow
let infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

// Keyword Search Location Request List
searchPlaces();
function searchPlaces() {
  let keyword = document.getElementById('keyword').value;

  if (!keyword.replace(/^\s+|\s+$/g, '')) {
    alert('키워드를 입력해주세요!');
    return false;
  }

  // Request a place search by keyword through the place search object.
  ps.keywordSearch(keyword, placesSearchCB);
}

// Callback function when location search is completed
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    displayPlaces(data);
    displayPagination(pagination);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert('검색결과가 존재하지 않습니다.');
    return;
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert('검색결과 중 오류가 발생했습니다.');
    return;
  }
}

/* Search list/marker s */
function displayPlaces(places) {
  let listEl = document.getElementById('placesList'),
    menuEl = document.getElementById('menu_wrap'),
    fragment = document.createDocumentFragment(),
    bounds = new kakao.maps.LatLngBounds(),
    listStr = '';

  // Remove items added to the search results list/marker
  removeAllChildNods(listEl);
  removeMarker();

  for (let i = 0; i < places.length; i++) {
    let placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
      marker = addMarker(placePosition, i),
      itemEl = getListItem(i, places[i]);

    // Reset map extent based on searched location(LatLngBounds)
    bounds.extend(placePosition);

    // search results list/marker mouseover, mouseout event
    (function (marker, title) {
      kakao.maps.event.addListener(marker, 'mouseover', function () {
        displayInfowindow(marker, title);
      });
      kakao.maps.event.addListener(marker, 'mouseout', function () {
        infowindow.close();
      });

      itemEl.onmouseover = function () {
        displayInfowindow(marker, title);
      };
      itemEl.onmouseout = function () {
        infowindow.close();
      };
    })(marker, places[i].place_name);

    fragment.appendChild(itemEl);
  }

  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;
  map.setBounds(bounds);
}
/* Search list/marker e */

// returns search result items as elements code
function getListItem(index, places) {
  let el = document.createElement('li'),
    itemStr =
      '<span class="markerbg marker_' +
      (index + 1) +
      '"></span>' +
      '<div class="info">' +
      `onclick="location.href='/info?id=${places.id}&&name=${places.place_name}&&location=${places.address_name}'"` +
      '<h5>' +
      places.place_name +
      '</h5>';

  if (places.road_address_name) {
    itemStr +=
      '<span>' +
      places.road_address_name +
      '</span>' +
      '<span class="jibun gray">' +
      places.address_name +
      '</span>';
  } else {
    itemStr += '<span>' + places.address_name + '</span>';
  }

  itemStr += '<span class="tel">' + places.phone + '</span>' + '</div>';

  el.innerHTML = itemStr;
  el.className = 'item';

  return el;
}

// display marker
function addMarker(position, idx, title) {
  let imageSrc =
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png',
    imageSize = new kakao.maps.Size(36, 37),
    imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691),
      spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10),
      offset: new kakao.maps.Point(13, 37),
    },
    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
    marker = new kakao.maps.Marker({
      position: position,
      image: markerImage,
    });

  marker.setMap(map);
  markers.push(marker);
  return marker;
}

// remove display marker
function removeMarker() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

// result search list paging
function displayPagination(pagination) {
  let paginationEl = document.getElementById('pagination'),
    fragment = document.createDocumentFragment(),
    i;

  // delete list
  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild(paginationEl.lastChild);
  }

  for (i = 1; i <= pagination.last; i++) {
    let el = document.createElement('a');
    el.href = '#';
    el.innerHTML = i;

    if (i === pagination.current) {
      el.className = 'on';
    } else {
      el.onclick = (function (i) {
        return function () {
          pagination.gotoPage(i);
        };
      })(i);
    }

    fragment.appendChild(el);
  }
  paginationEl.appendChild(fragment);
}

// click on the search result list or marker
function displayInfowindow(marker, title) {
  let content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

  infowindow.setContent(content);
  infowindow.open(map, marker);
}

// // delete click on the search result list el
function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}

let spots = gon.spots.map((ele) => {
    return {
        id: ele.id,
        sort_index: ele.sort_index,
        place_id: ele.place_id
    }
});

async function getDirection(originPlaceId, destinationPlaceId, travelMode, i) {
    let res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': gon.google_api,
            'X-Goog-FieldMask': 'routes.localized_values',
        },
        body: JSON.stringify({
            origin: {
                placeId: originPlaceId
            },
            destination: {
                placeId: destinationPlaceId
            },
            travelMode: travelMode,
            computeAlternativeRoutes: false,
            routeModifiers: {
                avoidTolls: false,
                avoidHighways: false,
                avoidFerries: false,
            },
            languageCode: 'ja',
        })
    });

    let data = await res.json();

    document.getElementById(`viewDuration${i}`).innerText = data.routes ? data.routes[0].localizedValues.duration.text : '-';
}

function init() {
    for (let i = 0; i < spots.length - 1; i++) {
        getDirection(spots[i].place_id, spots[i + 1].place_id, 'DRIVE', i);
    }
}

function pushToCalcDirection(i, travelMode) {
    getDirection(spots[i].place_id, spots[i + 1].place_id, travelMode, i);
}

async function changeSpotSort(i) {
    if (i > spots.length - 2) return;

    [spots[i], spots[i + 1]] = [spots[i + 1], spots[i]];

    [spots[i].sort_index, spots[i + 1].sort_index] = [spots[i + 1].sort_index, spots[i].sort_index];

    const isSortDone = await sendSortIndex();

    if (!isSortDone) {
        [spots[i], spots[i + 1]] = [spots[i + 1], spots[i]];
        [spots[i].sort_index, spots[i + 1].sort_index] = [spots[i + 1].sort_index, spots[i].sort_index];

        return;
    }

    const moveBox = document.getElementById(`spotBox${i}`);
    const targetBox = document.getElementById(`spotBox${i + 1}`);

    // upperSpotの上の座標を取得
    let upperSpotTop = targetBox.getBoundingClientRect().top;

    // lowerSpotの左上の座標を取得
    let lowerSpotTop = moveBox.getBoundingClientRect().top;

    // jqueryでupperSpotをlowerSpotの位置まで移動
    $(targetBox).animate({
        top: lowerSpotTop - upperSpotTop
    }, 500);

    // jqueryでlowerSpotをupperSpotの位置まで移動
    $(moveBox).animate({
        top: upperSpotTop - lowerSpotTop
    }, 500);

    // 500ms後に実行
    await new Promise(resolve => setTimeout(resolve, 500));

    [moveBox.innerHTML, targetBox.innerHTML] = [targetBox.innerHTML, moveBox.innerHTML]

    $(targetBox).animate({
        top: 0
    }, 0);

    $(moveBox).animate({
        top: 0
    }, 0);

    // idの入れ替え
    targetBox.id = `spotBox${i + 1}`;
    moveBox.id = `spotBox${i}`;

    pushToCalcDirection(i, 'DRIVE');

    if (i + 1 < spots.length - 1) pushToCalcDirection(i + 1, 'DRIVE');
    else if (i > 0) pushToCalcDirection(i - 1, 'DRIVE');
}

async function sendSortIndex() {
    const res = await fetch(`${location.origin}/groups/${gon.group_id}/update_sort`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify({spots})
    });

    const data = await res.json();

    return data.status === 'ok';
}

const getCsrfToken = () => {
    const metas = document.getElementsByTagName('meta');
    for (let meta of metas) {
        if (meta.getAttribute('name') === 'csrf-token') {
            return meta.getAttribute('content');
        }
    }
    return '';
}

init();

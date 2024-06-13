

document.addEventListener("DOMContentLoaded", function(e){
    
    // layerClickActive();
    imgLayerAdd(); 
    textLayerAdd();
    textLayerModify();
    textTypingBoxsizing();
    initLayer();
    layerDelete(); 
    fontSetting();
    layerOrderMove(); 
})

let isRotating = false; //회전중일땐 드래그 기능 동작하지 않게! (회전중일땐 true, 기본 false )
let lastActiveLayer = $('.layer') ;

// ⭐️ [레이어 이동] Layer Move first, last 
const layerOrderMove = (element) => {
    if(element){
        $('.RootCanvusSection .leftFixArti .menuList .moveFirst').click(function(){ //맨앞으로 버튼 클릭시
            $(element[0]).appendTo($(element[0]).parent());
        })
        $('.RootCanvusSection .leftFixArti .menuList .moveTail').click(function(){ //맨뒤로 버튼 클릭시
            $(element[0]).prependTo($(element[0]).parent());
        })
    }       
}

const rgbToHex = (rgb) => {
    // 숫자와 콤마를 제거하여 숫자 배열로 변환
    var rgbArray = rgb.match(/\d+/g).map(function(num) {
        return parseInt(num);
    });

    // 각각의 RGB 값을 16진수로 변환하고 두 자리로 패딩하여 Hex 문자열로 조합
    var hexColor = '#' + rgbArray.map(function(num) {
        var hex = num.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');

    return hexColor;
}

const updateFontSettings = (element) => {
    const fontSetting = element.find('.textInput');
    const fontFamily = fontSetting.css('font-family');
    const fontSizeValue = (fontSetting.css('font-size') || "16px").replace("px", ""); // 기본값을 16으로 설정
    const textAlign = fontSetting.css('text-align');
    const textColor = fontSetting.css('color');

    // 기존 폰트 값 입력해서 넣기
    $('#typeface').val(fontFamily);
    $('#fontSize').val(fontSizeValue);
    $('#textColor').val(rgbToHex(textColor));


    // 텍스트 정렬 버튼 상태 업데이트
    const textAlignButtons = $('.rightFixArti .settingDiv .settingBox .contentDiv .itemBtn');
    textAlignButtons.removeClass('active');
    if (textAlign === 'left' || textAlign === 'start' ) {
        textAlignButtons.eq(0).addClass('active');
    } else if (textAlign === 'center') {
        textAlignButtons.eq(1).addClass('active');
    } else {
        textAlignButtons.eq(2).addClass('active');
    }


};

const fontSetting = () => {
    let lastActiveLayer;

    // .layer 요소가 동적으로 생성되었을 경우를 대비하여 document에 이벤트를 등록합니다.
    $(document).on("click", ".layer", function() {
        lastActiveLayer = $(this);  // 업데이트: lastActiveLayer를 현재 클릭된 .layer로 설정
        updateFontSettings($(this));
    });
    
    // 폰트 설정 이벤트 바인딩
    bindFontSettings();
};

const bindFontSettings = () => {
    // 폰트 변경
    $('#typeface').change(function() {
        const selectedValue = $(this).val();
        lastActiveLayer.css('font-family', selectedValue);
    });

    // 폰트 사이즈 변경
    $('#fontSize').change(function() {
        const fontSizeValue = $(this).val();
        lastActiveLayer.find('.textInput').css('font-size', fontSizeValue + "px");
    });

    // 텍스트 정렬 변경
    $('.rightFixArti .settingDiv .settingBox .contentDiv .itemBtn.alignBtn').click(function() {
        const textAlignValue = $(this).val();
        $('.rightFixArti .settingDiv .settingBox .contentDiv .itemBtn').removeClass('active');
        $(this).addClass('active');
        lastActiveLayer.css('text-align', textAlignValue);
        lastActiveLayer.find('.textInput').css('text-align', textAlignValue);
    });

    // 글 색상 변경

    $('#textColor').change(function() {
        const fontColorValue = $(this).val();
        lastActiveLayer.css('color', fontColorValue);
    });
};

// ⭐️ [텍스트 입력] TextLayer Typing BoxSizing
const textTypingBoxsizing = () => {
    $(document).on('input', '.textInput', function() {
        $(this).closest('.layer').css('height', 'auto'); // 높이를 자동으로 설정
        this.style.height = (this.scrollHeight) + 'px'; // 스크롤 높이에 따라 조정
    })
}

// ⭐️ [텍스트 수정] textLayer Modify
const textLayerModify = () => {
    $(document).on('click' , '.layer .modifyBtn', function(event) {
        // console.log("텍스트 수정 버튼 클릭");
        $(this).closest('.layer').addClass('modify');
        const $textInput = $(this).closest('.layer').find('.textInput');
        const textLength = $textInput.val().length;
        $textInput.focus().prop('selectionStart', textLength).prop('selectionEnd', textLength);
    })
}

// ⭐️ [텍스트 추가] textLayer Add
const textLayerAdd = () => {
    $('#textLayerAdd').click(function(){
        // console.log('텍스트 레이어 추가');
        $('.rightFixArti .textSettingDiv').addClass('on');
        $('.leftFixArti .menuList').addClass('on')
        const textHTML = `
            <div class="layer active" data-type="text" style="width:140px; height:60px; font-family : Pretendard;">
                <div class="sizeBox">
                    <div class="rotateBtn circle"><label>회전</label></div>
                    <div class="leftTop circle"><label>좌측상단</label></div>
                    <div class="rightTop circle"><label>우측상단</label></div>
                    <div class="leftBottom circle"><label>좌측하단</label></div>
                    <div class="rightBottom circle"><label>우측하단</label></div>
                    <button type="button" class="delBtn"><img src="./img/canvus/trash.svg" alt="삭제" class="icon" /></button>
                    <button type="button" class="modifyBtn"><img src="./img/canvus/modify.svg" alt="수정" class="icon" /></button>
                    <textarea class="textInput" placeholder="텍스트를 입력해주세요.">텍스트</textarea>
                    <div class="canvusText"></div>
                </div>
            </div>
        `;

        const $layerWrap = $('#layerWrap');
        $layerWrap.append(textHTML); 
        // 방금 추가한 layer를 선택합니다.
        const $newLayer = $layerWrap.find('.layer').last();
        lastActiveLayer = $newLayer;
        updateFontSettings(lastActiveLayer)
        layerOrderMove(lastActiveLayer)
        // jQuery UI draggable 적용
        $newLayer.draggable({
            start: function(event, ui) {
                if (isRotating) {
                    return false; // 드래그 동작을 막음
                }
                lastActiveLayer = $(this); 
                updateFontSettings($(this));
                $(this).addClass('active');
            },
            drag: function(event, ui) {
                if (isRotating) {
                    return false; // 드래그 동작을 막음
                }
            },
            stop: function(event, ui) {
                $(this).removeClass('active');
            }
        });

        // jQuery UI resizable 적용
        $newLayer.resizable({
            handles: 'ne, se, sw, nw', // 조절 핸들 설정
            // aspectRatio: true, // 가로세로 비율 고정
            resize: function(event, ui) {
                $(this).addClass('active');
            },
            start: function(event, ui) {
                $(this).removeClass('modify');
            }
        });
    });
}

// ⭐️ [ 이미지 추가 ] imgLayer Add
const imgLayerAdd = () => {
    $('#imgUpload').on('change', function(e) {
        $('.leftFixArti .menuList').addClass('on')
        const files = e.currentTarget.files;
        // console.log(typeof files, files);
    
        [...files].forEach(file => {
            if (!file.type.match("image/.*")) {
              alert('이미지 파일만 업로드가 가능합니다.');
              return;
            }
    
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = document.createElement('img');
                img.setAttribute('src', event.target.result);
                img.setAttribute('data-file', event.target.result);
                img.setAttribute('class', "imgContent");

                const fileImgHtml = `
                <div class="layer" data-type="image" data-number="1" date-rotate="0">
                    <div class="sizeBox">
                        <button type="button" class="delBtn"><img src="./img/canvus/trash.svg" alt="삭제" class="icon" /></button>
                        <div class="rotateBtn circle"><label>회전</label></div>
                        <div class="leftTop circle"><label>좌측상단</label></div>
                        <div class="rightTop circle"><label>우측상단</label></div>
                        <div class="leftBottom circle"><label>좌측하단</label></div>
                        <div class="rightBottom circle"><label>우측하단</label></div>
                        ${img.outerHTML}
                    </div>
                </div>
                `;

                // console.log(fileImgHtml)
                // $('#layerWrap').append(fileImgHtml);
                const $layerWrap = $('#layerWrap');
                $layerWrap.append(fileImgHtml);
                // 방금 추가한 layer를 선택합니다.
                const $newLayer = $layerWrap.find('.layer').last();
                lastActiveLayer = $newLayer;
                layerOrderMove(lastActiveLayer)
                // jQuery UI draggable 적용
                $newLayer.draggable({
                    start: function(event, ui) {
                        if (isRotating) {
                            return false; // 드래그 동작을 막음
                        }
                        $(this).addClass('active');
                    },
                    drag: function(event, ui) {
                        if (isRotating) {
                            return false; // 드래그 동작을 막음
                        }
                    },
                    stop: function(event, ui) {
                        $(this).removeClass('active');
                    }
                });

                // jQuery UI resizable 적용
                $newLayer.resizable({
                    aspectRatio: true, // 가로세로 비율 고정
                    handles: 'ne, se, sw, nw', // 조절 핸들 설정
                    resize: function(event, ui) {
                        $(this).addClass('active');
                    }
                });
                // 여기서 img를 삽입하거나 필요한 처리를 수행할 수 있습니다.
                // 예를 들어, 이미지를 어딘가에 삽입하거나 화면에 표시할 수 있습니다.
            };
            reader.readAsDataURL(file);
        });

    });
    
}

// ⭐️ [ 레이어 클릭 ] layer Click 
const layerClickActive = () => {
    // 레이어 클릭시 해당 레이어에 active 클래스 추가 
    $('#layerWrap').on('mousedown touchstart', '.layer', function() {
        $('#layerWrap .layer').removeClass('active')
        $(this).addClass('active');
        lastActiveLayer = $(this);
        layerOrderMove($(this))
        $('.leftFixArti .menuList').addClass('on')
        //텍스트 레이어 클릭시, 텍스트 수정 메뉴 active
        if($(this).data('type') === "text"){
            $('.rightFixArti .textSettingDiv').addClass('on');
        }else{
            $('.rightFixArti .textSettingDiv').removeClass('on');
        }
    });

    /* 
        .layer 요소 외의 영역 클릭시 
        active, modify등 필요없는 클래스 제거 
    */
    $(document).mouseup(function(e) {
        var container = $(".layer");
        if (!container.is(e.target) && container.has(e.target).length === 0 && $('.rightFixArti').has(e.target).length === 0  ) {
            container.removeClass('active');
            //text canvus 텍스트 레이어 추가후 modify 클래스 삭제. 
            container.removeClass('modify');
            $('.leftFixArti .menuList').removeClass('on')
        }
    });
}

// ⭐️ [ 레이어 회전 ]
const layerRotation = () => {
    let rotateStartX = 0;
    let rotateValue = 0;
    let sensitivity = 0.2; // 회전 민감도 설정

    // 회전 기능
    $(document).on('mousedown touchstart' , '.layer .rotateBtn', function(event) {
        event.preventDefault(); // 기본 터치 이벤트 제거
        var layer = $(this).closest('.layer');
        rotateStartX = event.pageX || event.originalEvent.touches[0].pageX;
        rotateValue = parseInt(layer.attr('data-rotate') || 0);
        isRotating = true;

        $(document).on('mousemove.rotate touchmove.rotate', function(event) {
            if (isRotating) {
                var endX = event.pageX || event.originalEvent.touches[0].pageX;
                var distance = endX - rotateStartX; // 드래그 이동 거리
                var newRotation = rotateValue + (distance * sensitivity);

                // 회전 각도를 0도에서 360도 사이로 유지
                newRotation = newRotation < 0 ? 360 + newRotation : newRotation % 360;

                layer.css('transform', 'rotate(' + newRotation + 'deg)');
                layer.attr('data-rotate', newRotation);
            }
        });

        $(document).on('mouseup.rotate touchend.rotate', function() {
            if (isRotating) {
                $(document).off('mousemove.rotate touchmove.rotate'); // 마우스를 떼었을 때 이벤트 제거
                $(document).off('mouseup.rotate touchend.rotate');
                isRotating = false;

                // 드래그와 리사이즈 활성화
                $('.layer').resizable('enable');
                $('.layer').draggable('enable');
            }
        });

        // 회전 중일 때 드래그와 리사이즈를 비활성화
        $('.layer').resizable('disable');
        $('.layer').draggable('disable');
        event.stopPropagation(); // 다른 이벤트와의 충돌 방지
    });
}
// ⭐️ [ 레이어 사이즈 조절 ]
const layerResize = () => {
    // 크기 조절 기능
    $('.layer').resizable({
        aspectRatio: true, // 가로세로 비율 고정
        handles: 'ne, se, sw, nw', // 조절 핸들 설정
        resize: function(event, ui) {
            $(this).addClass('active');
        }
    });
}
// ⭐️[레이어 드래그] 
const layerDrag = () => {
    // 드래그 기능
    $('.layer').draggable({
        start: function(event, ui) {
            $(this).addClass('active');
        }
    });
}

// 레이어 초기화
const initLayer = () => {
    layerClickActive();
    layerRotation();
    layerResize();
    layerDrag();
}

// ⭐️ [레이어 삭제]
const layerDelete = () => {
    $(document).on('mousedown touchstart' , '.layer .delBtn', function(event) {
        // console.log('삭제버튼 클릭');
        const userConfirmed = confirm('레이어를 삭제하시겠습니까?');
        if (userConfirmed) {
            $(this).closest('.layer').remove();
            $('.RootCanvusSection .leftFixArti .menuList').removeClass('on');
        } else {
            return false;
        }
    })

    $(document).on('mousedown touchstart' , '.RootCanvusSection .leftFixArti .menuList .delLayer', function(event) {
        const userConfirmed = confirm('레이어를 삭제하시겠습니까?');
        if (userConfirmed) {
            lastActiveLayer.remove();
            $('.RootCanvusSection .leftFixArti .menuList').removeClass('on');
        } else {
            return false;
        }
    })
}

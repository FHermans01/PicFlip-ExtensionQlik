define( [
  "qlik",
  "jquery",
  "css!./css/style.css",
  "text!./layout.html",
  './js/properties',
  './js/functions'
], function (qlik, $, cssContent,  template, props, funcs) {
  'use strict'
  var isReversed = false;
  var isLocked = false;
  var currentCss;
  var path ="/extensions/WorkingPictureShower2";

	return {
    template: template,
		definition : props,
		support : {
			export: true,
			exportData : true
		},
    initialProperties : {
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 10,
					qHeight : 50
				}]
			}
		},
    paint: function ($element, layout) {
      this.$scope.qlik=qlik;
      if ( !this.$scope.table ) {
        this.$scope.table = qlik.table( this );
      }
      console.log(this.$scope.table);
      this.$scope.useTitles = layout.props.useTitles;
      var numMeasures =  this.$scope.layout.qHyperCube.qMeasureInfo.length;
      $( document ).ready(function() {
        var font_h3 = (0.65 + 1/numMeasures)*layout.props.imageSize/10*0.5;
        var font_h2 = (0.65 + 1/numMeasures)*layout.props.imageSize/10;
        if(layout.props.fontsizeMeasure1 != ""){
          $(".measure1 h3").css("font-size", layout.props.fontsizeMeasure1*0.5);
          $(".measure1 h2").css("font-size", layout.props.fontsizeMeasure1*1);
        } else {
          $(".measure1 h3").css("font-size", font_h3);
          $(".measure1 h2").css("font-size", font_h2);
        }
        if(layout.props.fontsizeMeasure2 != ""){
          $(".measure2_title").css("font-size", layout.props.fontsizeMeasure2*0.5);
          $(".measure2").css("font-size", layout.props.fontsizeMeasure2*1);
        } else {
          $(".measure2_title").css("font-size", font_h3);
          $(".measure2").css("font-size", font_h2);
        }
        if(layout.props.fontsizeMeasure3 != ""){
          $(".measure3_title").css("font-size", layout.props.fontsizeMeasure3*0.5);
          $(".measure3").css("font-size", layout.props.fontsizeMeasure3*1);
        } else {
          $(".measure3_title").css("font-size", font_h3);
          $(".measure3").css("font-size", font_h2);
        }
        if(layout.props.colorMeasure1.length != 0){
          $(".measure1").css("color", layout.props.colorMeasure1);
          $(".measure1_title").css("color", ("#"+calculateLighterVersion(layout.props.colorMeasure1, 0.15)));
        }
        if(layout.props.colorMeasure2 != 0){
          $(".measure2").css("color", layout.props.colorMeasure2);
          $(".measure2_title").css("color", ("#"+calculateLighterVersion(layout.props.colorMeasure2, 0.15)));
        }
        if(layout.props.colorMeasure3 != 0){
          $(".measure3").css("color", layout.props.colorMeasure3);
          $(".measure3_title").css("color", ("#"+calculateLighterVersion(layout.props.colorMeasure3, 0.15)));
        }
        setUpCss();
      });

      function calculateLighterVersion(color, percent){
        if(color.length == 3){
          var i = 1;
          while(color.length < 7){
            color += color[i];
            i++;
              console.log(color);
          }
        } else if(color.length == 7){
          var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
          return ((0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1));
        } else {
          return color;
        }
      }
      function removeFlip() {
        $('#flipFunction_horizontal').remove();
        $('#flipFunction_vertical').remove();
        $('#flipFunction_reversed_vertical').remove();
        $('#flipFunction_reversed_horizontal').remove();
      }
      function addFlip(){
        removeFlip();
        if(layout.props.flipOrientation == "h" && !isReversed){
          $('<link rel="stylesheet" id="flipFunction_horizontal" type="text/css" href="' + path + '/css/flipFunction_horizontal.css">').appendTo("head");
        } else if(layout.props.flipOrientation == 'v' && !isReversed){
          $('<link rel="stylesheet" id="flipFunction_vertical" type="text/css" href="' + path + '/css/flipFunction_vertical.css">').appendTo("head");
        } else if(layout.props.flipOrientation =='v' && isReversed){
          $('<link rel="stylesheet" id="flipFunction_reversed_vertical" type="text/css" href="' + path + '/css/flipFunction_reversed_vertical.css">').appendTo("head");
        } else {
          $('<link rel="stylesheet" id="flipFunction_reversed_horizontal" type="text/css" href="' + path + '/css/flipFunction_reversed_horizontal.css">').appendTo("head");
        }
      }
      function removeCss(){
        $('#verticalCss').remove();
        $('#horizontalCss').remove();
        $('#verticalCss_reversed').remove();
        $('#horizontalCss_reversed').remove();
        $('.back-extension-title').removeClass('align-top');
        $('.back-extension-title').removeClass('align-center');
        $('.back-extension-title').removeClass('align-bottom');
      }
      function setUpCss(){
        removeCss();
        $('.titleHolder').css("width", $('.container').width() - $('.buttonHolder').width());
        $('.flipper').css("transition", layout.props.flipSpeed + "s");
        $('.front-extension').css({"transition": layout.props.flipSpeed + "s", "width": layout.props.imageSize, "height": layout.props.imageSize});
        $('.back-extension').css({"transition": layout.props.flipSpeed + "s", "width": layout.props.imageSize, "height": layout.props.imageSize});
        $('.li-extension').css({"width": layout.props.imageSize, "height": layout.props.imageSize});
        $('.flip-container').css({"width": layout.props.imageSize, "height": layout.props.imageSize});
        $('.back-extension-display').css({"opacity": layout.props.backsideOpacity});

        var verticalAlign = layout.props.textPlacement_vertically;

        $('.back-extension-title h2, h3').css("padding", "0");
        if(verticalAlign == "top"){
          $('.back-extension-title').css({
            "position": "absolute",
            "left": "50%", "top": "0%",
            "transform": "translate(-50%, 0%)"
          });
        } else if (verticalAlign == "center"){
          $('.back-extension-title').css({
            "position": "absolute",
            "left": "50%", "top": "50%",
            "transform": "translate(-50%, -50%)"
          });
        } else if (verticalAlign == "bottom"){
          $('.back-extension-title').css({
            "position": "absolute",
            "left": "50%", "top": "100%",
            "transform": "translate(-50%, -100%)"
          });
        }
        var textAlignment = layout.props.textAlignment;
        if(textAlignment == "L"){
          $('.back-extension-title').css({"text-align":"left"});
          $('.back-extension-title h2, h3').css("padding-left", "5px");
        } else if(textAlignment == "C"){
          $('.back-extension-title').css({"text-align":"center"});
        } else {
          $('.back-extension-title').css({"text-align":"right"});
          $('.back-extension-title h2, h3').css("padding-right", "5px");
        }

        $('.corner-circle').css({"color": layout.props.cornerCircleColor, "display": "block", "border": "3px dotted " + layout.props.cornerCircleColor});
        if(!layout.props.showCornerCircle){
          $('.corner-circle').css({"display": "none"});
        }
        if(layout.props.useBoxShadow){
          $('.corner-circle').css({"box-shadow": "3px 3px 3px rgba(0,0,0,0.3)"});
        } else {
          $('.corner-circle').css({"box-shadow": ""});
        }

        if(layout.props.cropType == 'cover'){
          $('.image-display').css({"object-fit": "cover"});
        } else if(layout.props.cropType == 'contain') {
          $('.image-display').css({"object-fit": "contain"});
        } else {
            $('.image-display').css({"object-fit": "fill"});
        }

        if(!layout.props.showFlipButtons) {
          $('.buttonRow').css("display", "none");
        } else {
          $('.container').css("height", "100%");
          $('.container').css("height", $('.container').height()-60);
          $('.buttonRow').css("display", "block"); }
        if(layout.props.flipOrientation == "h"){
          if(isReversed){
            currentCss = "fh_r";
            $('<link rel="stylesheet" id="horizontalCss_reversed" type="text/css" href="' + path + '/css/flipHorizontal_reversed.css">').appendTo("head");
          } else {
            currentCss = "fh";
            $('<link rel="stylesheet" id="horizontalCss" type="text/css" href="' + path + '/css/flipHorizontal.css">').appendTo("head");
          }
        } else {
          if(isReversed){
            currentCss = "fv_r";
            $('<link rel="stylesheet" id="verticalCss_reversed" type="text/css" href="' + path + '/css/flipVertical_reversed.css">').appendTo("head");
          } else {
            currentCss = "fv";
            $('<link rel="stylesheet" id="verticalCss" type="text/css" href="' + path + '/css/flipVertical.css">').appendTo("head");
          }
        }
        if(!isLocked){
          $("#flipButton").css({"background-color": "#BADA55"});
          addFlip();
        }
      }
      $('#flipButton').unbind().click( function () {
        if(!isLocked){
          isReversed = !isReversed;
          setUpCss();
        }
      });
      $('#lockButton').unbind().click( function () {
        isLocked = !isLocked;
        if(isLocked){
          $("#lockButton_img").attr("src", path + "/images/lock_white.png");
          console.log("Now: isLocked = true");
          $("#lockButton").css("background-color", "#da5555");
          $("#flipButton").css({"background-color": "#ccc"});
          removeFlip();
        } else {
          $("#lockButton_img").attr("src", path + "/images/lock_red.png");
          console.log("Now: isLocked = false");
          $("#lockButton").css("background-color", "");
          $("#flipButton").css({"background-color": "#BADA55"});
          addFlip();
        }
      });

      return qlik.Promise.resolve();
    },
  };
} );

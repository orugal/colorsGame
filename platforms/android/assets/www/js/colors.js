openFB.init('755239061240797','http://www.wannabe.com.co/', window.localStorage);
var timer           =   60;//tiempo inicial del juego
var tiempoTimer     =   0;//variable que controla el tiempo del timer
var cantIni         =   3;//cantidad de patrones iniciales
var timeCurtain     =   3;//tiempo que durara la cortina de entrada
var patternM        =   "";//patron generado por la maquina
var patternJ        =   "";//patron generado por el usuario
var countJ          =   "";//indicador de presion de botones por el usuario
var hidePattern     =   0;//variable que controla el tiempo que durara la accion de esconder patron
var scoreDef        =   10;//puntaje por Default, es decir siempre que acierte se le darán 10 puntos
var score           =   0;//puntaje actual del jugador
var timeHidePattern = 1000;//tiempo que durara visible el patron ante el usuario
var timeEmogi       =   0;
var cuoteIncrement  =   10;
var cuoteIncrementJ =   0;
var html5_audiotypes={ 
	'mp3': "audio/mpeg",
	'mp4': "audio/mp4",
	'ogg': "audio/ogg",
	'wav': "audio/wav"
}
var buttons =   [1,2,3,4];
var buttonSound = "";
var cortina     =  0;

$(document).ready(function(){
    colors.startColors();
    buttonSound = colors.createsoundbite("../sound/buttonSound.wav");
    $('#game').bind('pageshow', function() {
         colors.startGame();
    });
    $('#panelLogin').bind('pageshow', function() {
         colors.resetGame();
    });
    $('#panelInstrucciones').bind('pageshow', function() {
         colors.resetGame();
    });
   
});
var colors = 
{
    startColors:function()
    {
        //var sessionFB   =   openFB.oauthCallback('http://www.colorsgame.com/');
        //aca es donde inicia todo
        //valido si existe la session de facebook
        var session =   localStorage.getItem("colorsSesion");
        if(session == undefined)//no hay session
        {
            //alert("no hay session");
        }
        else
        {
            //alert("aca?")
            if(session == 1)
            {
                //alert("true?")
                $("#btnLogin").hide();
                $("#btnStart").fadeIn();
                $("#btnLogout").fadeIn();
                $("#btnIns").fadeIn();
                colors.facebookGetInfo();
            }
            else
            {
                //alert("false?")
                $("#btnLogin").fadeIn();
                $("#btnStart").hide();
                $("#btnLogout").hide();
                $("#btnIns").hide();
            }
        }
    },
    facebookLogin:function()
    {
        openFB.login('email',colors.facebookLoginSucces,colors.facebookLoginError);
        
    },
    facebookLoginSucces:function()
    {
       localStorage.setItem("colorsSesion",1);
       colors.startColors();
       colors.facebookGetInfo();
    },
    facebookLoginError:function()
    {
        
    },
    facebookGetInfo:function()
    {
        openFB.api({
            path: '/me',
            success: function(data) 
            {
                console.log(JSON.stringify(data));
                $("#nameUser").html(data.first_name);
                $("#fotoUser").html("<img src='https://graph.facebook.com/"+data.id+"/picture?width=150&height=150'/>");
            },
            error: colors.errorHandler});
    },
    errorHandler:function(error) {
        alert(error.message);
    },
    facebookLogout:function()
    {
        openFB.logout();
        localStorage.setItem("colorsSesion",0);
        colors.startColors();
    },
    revoke:function() {
        openFB.revokePermissions(
                function() {
                    alert('Permissions revoked');
                    localStorage.setItem("colorsSesion",0);
                    colors.startColors();
                },
                colors.errorHandler);
    },
    redirectToGame:function()
    {
        
    },
    resetGame:function()
    {
        //inicializo el tiempo
        timer       = 60;
        $("#puntaje").html(score+'<span class="miniText">SEG</span>');
        //borro los patrones del juego
        patternM    =   "";
        //contador del usuario
        countJ      =   "";
        //limpio el div de los patrones
        $("#pattern").html("&nbsp;");
        //pongo el nuevo tiempo
        $("#tiempo").html(timer+'<span class="miniText">SEG</span>');
        //detengo la variable del conteo de tiempo anterior
        clearTimeout(tiempoTimer);
        //quito el div de los numeritos de l contador
        $(".curtain").remove();
        //elimino todos los emoticones
        $(".emogi").remove();
        
        tiempoTimer     =   0;//variable que controla el tiempo del timer
        cantIni         =   3;//cantidad de patrones iniciales
        timeCurtain     =   3;//tiempo que durara la cortina de entrada
        patternJ        =   "";//patron generado por el usuario
        countJ          =   "";//indicador de presion de botones por el usuario
        hidePattern     =   0;//variable que controla el tiempo que durara la accion de esconder patron
        scoreDef        =   10;//puntaje por Default, es decir siempre que acierte se le darán 10 puntos
        score           =   0;//puntaje actual del jugador
        timeHidePattern = 1000;//tiempo que durara visible el patron ante el usuario
        timeEmogi       =   0;
        cuoteIncrement  =   10;
        cuoteIncrementJ =   0;
    },
    startGame:function()
    {
        //traigo la información del usuario
        colors.facebookGetInfo();
        //reseteo el juego
        colors.resetGame();
        //muestra cortina de inicio
        colors.startCurtain(timeCurtain);
        //inicializo los botones con lo que deben hacer
        //$(".botonesGame").on("tap", function(){;
        $(".botonesGame").click(function(){
            if(!$(this).hasClass("nogame"))//si estan habilitados para jugar lo dejo jugar
            {
                //elimino la clase que hace alumbrar todos los botnes
                $(".botonesGame").removeClass("filtro");
                //hago alumbrar solo el botón cliqueado
                $(this).addClass("filtro");
                //realizo el efecto que me dice cuando presiono el boton y vuelvo a soltarlo
                setTimeout(function(){
                    $(".botonesGame").removeClass("filtro");
                },80);
                colors.sonar(buttonSound);
                countJ      +=   $(this).data("val"); 
                patternJ    +=   $(this).data("val"); 
                if(countJ.length == cantIni)
                {
                    colors.validateGame();
                    countJ  =   "";
                    //elimino la clase que hace alumbrar los botones
                    $(".botonesGame").removeClass("filtro");
                }
            }
        });
    },
    startCurtain:function(tiempo)
    {
        //alert(tiempo);
        if(tiempo != 0)
        {
            
            //dibujo el tiempo y pongo todos los botones enla clase no game
            if($(".curtain").length == 0)//si no se ha dibujado el div lo dibujo
            {
                var dibujo  =   "<div class='curtain'><div class='contTime'><div id='timeCurtain'></div></div></div>";
                $("body").append(dibujo);
            }
            var altoNavegador   =   $(window).height();
            $(".curtain").css("height",altoNavegador+"px");
            $("#timeCurtain").html(tiempo);
            tiempo--;
            cortina = setTimeout(function(){
                    colors.startCurtain(tiempo);
                },1000);
        }
        else
        {
            //si ya supera los 5 segundos borro la variable para que el juego proceda
            clearTimeout(cortina);
            //quito la cortina
            $(".curtain").remove();
            //quito la clase no game a los botones para que la gente pueda jugar
            $(".botonesGame").removeClass("nogame");
            colors.gameProcces();
        }
    },
    gameProcces:function()
    {
        //inicializo el tiempo
        colors.startTime();
        //debo empezar a mostrar los patrones
        colors.generatePattern();
    },
    validateGame:function(e)
    {
        //si los dos patrones son iguales el jugador lo ha hecho bien le debo dar puntaje
        //alert(patternM+" - "+patternJ)
        if(patternM == patternJ)// si acierta
        {
            patternJ    =   "";
            patternM    =   "";
            colors.addScore();
            colors.createEmogi(2);
            cuoteIncrementJ++;
            //si realiza 10 intentos incremento los patrones y regalo 10 segundos al jugador
            if(cuoteIncrementJ == cuoteIncrement)
            {
                cantIni++;
                cuoteIncrementJ=0;
                timer+=10;
            }
            colors.generatePattern();
            
        }
        else//si el jugador lo ha hecho mal debo generarle un nuevo patron
        {
            navigator.notification.vibrate(100);
            patternJ    =   "";
            patternM    =   "";
            colors.createEmogi(1);
            cuoteIncrementJ++;
            colors.generatePattern();
            //si realiza 10 intentos incremento los patrones y regalo 10 segundos al jugador
            /*if(cuoteIncrementJ == cuoteIncrement)
            {
                cantIni++;
                cuoteIncrementJ=0;
                timer+=10;
            }*/
        }
    },
    addScore:function()
    {
        score   +=  parseInt(scoreDef);
        $("#puntaje").html(score+'<span class="miniText">PTS</span>');
    },
    generatePattern:function()
    {
        var pattern  =   "";
            patternM =   "";
        //deshabilito los botones para que no puedan jugar mientras se genera y se muestra el patron
        //$(".botonesGame").addClass("nogame");
        //alert(cantIni);
        for(g=1;g<=cantIni;g++)
        {
            var rand    =   Math.round(Math.random()*3);
            var newBtn  =   buttons[rand]
            pattern  +="<img src='img/btn"+newBtn+".png' class='patternBtn' id='patter"+g+newBtn+"'/> ";
            patternM += newBtn;
        }
        $("#pattern").html(pattern);
        hidePattern    =   setTimeout(function(){
            $(".botonesGame").removeClass("nogame");
            $(".patternBtn").addClass("gray");
            //$(".patternBtn").addClass("filtro");
            clearTimeout(hidePattern);
        },timeHidePattern);
        
    },
    startTime:function()
    {
        if(timer > 0)
        {
            tiempoTimer = setTimeout(function(){
            colors.startTime();
            },1000);
            timer--;
            $("#tiempo").html(timer+'<span class="miniText">SEG</span>');
        }
        else
        {
            //hago que el juego finalice
            alert("Juego terminado");
            colors.resetGame();
        }
        
    },
    createEmogi:function(emogi)
    {
        //alert(emogi)
        if(emogi == 1)//mal
        {
            var clase   =   "bad";
        }
        else if(emogi == 2)//bien
        {
            var clase   =   "well"; 
        }
        var rand    =   Math.round(Math.random()*1000);
        var emo     =   "<div class='emogi "+clase+"' id='emogi"+rand+"'></div>";
        var altoVentana   =   $(window).height();
        var anchoVentana   =   $(window).width();
        var mitadVentana    =   ((parseInt(altoVentana) / parseInt(2)) - parseInt(100));
        var mitadVentanaA    =   ((parseInt(anchoVentana) / parseInt(2)) - parseInt(25));
        $("body").append(emo);
        $("#emogi"+rand).css("top",mitadVentana+"px");
        $("#emogi"+rand).css("right",mitadVentanaA+"px");
        $("#emogi"+rand).animate({
            top: "-=80",
            opacity: 0.25
          }, 500, function() {
            $("#emogi"+rand).hide();
            $("#emogi"+rand).remove();
          });
       /*timeEmogi   =   setTimeout(function(){
            $("#emogi"+rand).fadeout();
            $("#emogi"+rand).remove();
            clearTimeout(timeEmogi);
        },500);*/
        
    },
    sonar:function(audio)
    {
        
        var html5audio	=	document.createElement('audio');
        if(html5audio.canPlayType)
        { 
            //alert("here");
           audio.playclip();
        }
    },
    detener:function(audio)
    {
        var html5audio	=	document.createElement('audio');
        if(html5audio.canPlayType)
        { 
            audio.stopclip();
        }
    },
    createsoundbite:function(sound)
    {
        var html5audio	=	document.createElement('audio');
        if (html5audio.canPlayType)
        { //check support for HTML5 audio
            for (var i=0; i<arguments.length; i++)
            {
                    var sourceel=document.createElement('source');
                    sourceel.setAttribute('src', arguments[i]);
                    if (arguments[i].match(/\.(\w+)$/i))
                    sourceel.setAttribute('type', html5_audiotypes[RegExp.$1]);
                    html5audio.appendChild(sourceel)
            }
            html5audio.load()
            html5audio.playclip=function()
            {
                    html5audio.play();
            }
            html5audio.stopclip=function()
            {
                    html5audio.currentTime=0;
                    html5audio.pause();
            }
            return html5audio
        }
    },
    roulette:function()
    {
        
    },
    getPhoneGapPath:function () 
    {
        var path = window.location.pathname;
        path = path.substr( path, path.length - 10 );
        //alert(path);
        return 'file://' + path;
    }
    
}
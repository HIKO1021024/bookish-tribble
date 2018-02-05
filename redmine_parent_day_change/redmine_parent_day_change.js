//期日一括変更スクリプト

//子チケットの遅延構造を保ったまま日付を変更する
//ターゲットとなる子チケットの期日と、変更予定の期日の差分を取得し
//その後、全子チケットに差分を適用する。


$(function(){
var red_url = "http://*******/redmine" //redmineのアドレス。最後に/はいらない 
//redmineのアドレス最後に/は必要ない
var textboxclass = ".cf_41";//乗っ取るテキストボックスのID名 「.」が必要
var targettracker = "トリガーとするチケットの項目名";//このチケットの日付をチェックする
var status_id = "34" //34が「変更完了ステータス」;
var status_id_name = 
"変更完了ステータス";//idと名前が一致しているか確認するために使用
var end_st = ["完了","作業完了"]//この名前である場合、日付もステータスも変更しない。
var ch_tar_st = "信じ"//変更対象のステータスを記入

var issuearry = [];//
var parent_issue_status2;//parent_issue_status変数を配列に変換したものを格納
var target_ticket_issues = [];//変更するチケットのidが配列で入る
var target_ticket_changed = [];//変更したチケットの実行結果が入る
var target_parent;//親チケットの実行結果が入る
var change_day;//変更する日付を格納
var sp_startdate; //変更する開始日を取得
var sp_changedate;//変更する期日を取得
var ch_day_sabun ;//変更する日の差分を取得--○日分動かすか
var ch_alart;


$(function () {
  //エラーチェック
  if ($(textboxclass).length >0 ){
    er = err_ch();
    if (er == "error"){
      console.log('エラーが存在するため終了');
      return;
    }
  }
  //テキストボックスを作成
  $(textboxclass).each(function() {
    //if($(this).text() != "[この値は変更しないでください]"){
      //権限が無い場合、この値が見えないので発動しない
    //  return "error";
    //}
    //権限で絞る予定だったが廃止
    $(this).text("")
    name =  $(this).parent().attr('id')
    var targettext = "#text_" + name;
    $(this).append('<input type="text" id="text_" class="text_jquary">');
    $('#text_').attr('id', 'text_' + name) ;
    issuearry.push('#text_' + name);
    $(targettext).datepicker();

  });


  //変更されたらスクリプトが発火
  $('.text_jquary').each(function(){
    console.log($(this).attr('id'))
    $('#' + $(this).attr('id')).change(function() {
      //入力された情報を取得
      change_day = $(this).val()
      console.log('入力された内容は' + change_day)
        //不正な値ならアラート&終了
      //チケット番号を取得
      var parent_issue_no = $(this).attr('id').replace("text_issue-","");
      //チケット情報を取得
       var parent_issue_status = $.getJSON(red_url + "/issues/" + parent_issue_no + ".json");
       timerID = setInterval( function(){
         if(parent_issue_status.readyState == 4){
           clearInterval(timerID);
           parent_issue_status2 = JSON.parse(parent_issue_status.responseText);
           console.log(parent_issue_status2);
           issue_ikkatu()
         }
       },200);
    });
  });
});

function err_ch(){
  //エラーチェック
  //ステータスidが存在しているかチェック
  //ついでにアドレスが存在しているかもチェック
  var status_all = $.getJSON(red_url + "/issue_statuses.json");
  timerID = setInterval( function(){
    if(status_all.readyState == 4){
      console.log('読み込み完了');
      console.log(status_all);
      if(status_all.status == 200){
        console.log('ステータス正常');
        clearInterval(timerID);
      }else{
        clearInterval(timerID);
        alert("redmineアドレスが存在しません")
        return "error";
      }

      for (var i = 0 ; i < status_all.length; i++){
        if (status_all.responseJSON.issue_statuses[i].id == status_id){
          if (status_all.responseJSON.issue_statuses[i].name != status_id_name){
            clearInterval(timerID);
            alert("ステータスidが存在しません")
            return "error";
          }
        }
      }
    }
  },200);
}


function err_ch2(){
  //エラーチェックその２ 
選択されたチケットが親チケットでなかった場合、エラー
  console.log(target_ticket_issues);
  console.log("lengthは"+ target_ticket_issues.responseJSON.issues.length);
  if(target_ticket_issues.responseJSON.issues.length == 0 ){
      console.log("エラー");
      return "error";
  }
}

function issue_ikkatu() {
  var err_st = 0; //変更に失敗した場合、もう一度行う用のフラグ
  console.log('一括取得開始');
  console.log('ループ終了');
  console.log(timerID);
  //失敗したらアラート&終了
    //未実装
  //プロジェクト名を取得
    pjid = parent_issue_status2.issue.project.id;
  //プロジェクト内のチケットを取得
  //全体の数を取得
  target_ticket_issues  = $.getJSON(red_url + "/projects/" + pjid + "/issues.json?limit=100&status_id=*&parent_id=" + parent_issue_status2.issue.id);
  timerID = setInterval( function(){
    if(target_ticket_issues.readyState == 4){
      er = err_ch2();
      if(er == "error") {
        clearInterval(timerID);
        alert("選択されたチケットの子が見つかりません")
        return;//エラーチェックがエラーであればリターン
      }
      console.log('対象チケット取得');
      clearInterval(timerID);
      target_change();
    }
  },200);
}

function target_change(){
    ch_alart = ""; //最後に変更した内容をおしらせする用
    //ターゲットとなるチケットが絞り込めたため、一括変更を開始。
    //作業実施の開始日を取得
    for (var i = 0 ; i < 
target_ticket_issues.responseJSON.issues.length; i++){
      if(target_ticket_issues.responseJSON.issues[i].tracker.name == targettracker ){
        sp_startdate = target_ticket_issues.responseJSON.issues[i].start_date.split('-');
        sp_changedate = change_day.split('/');
        ch_day_sabun 
=daytodaycal(sp_startdate[0],sp_startdate[1],sp_startdate[2],sp_changedate[0],sp_changedate[1],sp_changedate[2]);
      }
    }
    //日付を変更、ターゲットチケットの数だけ繰り返す
    for (var i = 0 ; i < target_ticket_issues.responseJSON.issues.length; i++){
      var sp_targetst = target_ticket_issues.responseJSON.issues[i].start_date.split("-");
      var sp_targetdu = target_ticket_issues.responseJSON.issues[i].due_date.split("-");
      console.log('チケット編集'+i)
      //チケットステータスが完了であれば何も行わない
if(end_st.indexOf(target_ticket_issues.responseJSON.issues[i].status.name) == -1){
        if(target_ticket_issues.responseJSON.issues[i].status.name == "仮日程"){
          console.log('完了ではないし、ステータスが仮日程'+i)
          //チケットステータスが完了でないものに関して日付の変更を行う。
          //かつステータスが仮日程のものを対象とする
          console.log('開始日' + sp_targetst);
          console.log('期日' + sp_targetdu);
          console.log('開始変更日' + daycal(sp_targetst[0],sp_targetst[1],sp_targetst[2],ch_day_sabun));
          console.log('期日変更' + daycal(sp_targetdu[0],sp_targetdu[1],sp_targetdu[2],ch_day_sabun));
          target_ticket_changed[i] = $.ajax({
            type: "PUT",
            url: red_url + "/issues/" + target_ticket_issues.responseJSON.issues[i].id +".json",
            data:{
              "issue": {
                "start_date": daycal(sp_targetst[0],sp_targetst[1],sp_targetst[2],ch_day_sabun),
                "due_date": daycal(sp_targetdu[0],sp_targetdu[1],sp_targetdu[2],ch_day_sabun),
                "status_id" : status_id,
              }
            }
          });
        }else{
          //ステータスが仮日程ではないものは日付だけ動かす
          console.log('開始日' + sp_targetst);
          console.log('期日' + sp_targetdu);
          console.log('開始変更日' + daycal(sp_targetst[0],sp_targetst[1],sp_targetst[2],ch_day_sabun));
          console.log('期日変更' + daycal(sp_targetdu[0],sp_targetdu[1],sp_targetdu[2],ch_day_sabun));
          console.log('ステータスが仮日程ではない'+i)
          target_ticket_changed[i] = $.ajax({
            type: "PUT",
            url: red_url + "/issues/" + target_ticket_issues.responseJSON.issues[i].id +".json",
            data:{
              "issue": {
                "start_date": daycal(sp_targetst[0],sp_targetst[1],sp_targetst[2],ch_day_sabun),
                "due_date": daycal(sp_targetdu[0],sp_targetdu[1],sp_targetdu[2],ch_day_sabun),
              }
            }
          });

        }
      }else{
        console.log('完了チケットはスキップ'+i)
      }
    }
    //親のステータスを変更
    if (parent_issue_status2.issue.status.name == "仮日程"){
     console.log('親を変更')
      target_parent = $.ajax({
        type: "PUT",
        url: red_url + "/issues/" + parent_issue_status2.issue.id +".json",
        data:{
          "issue": {
            "status_id" : status_id ,
          }
        }
      });
     }

    var put_c = put_check();
    console.log("put_c"+put_c);
    if (put_c == "end"){
      console.log('終了');
      clearInterval(timerID_tar_ch);
    }
}

function put_check() {
  timerID_tar_ch_st = setInterval( 
function(){//ステータスが全て読み込み完了になったらエラーチェックを行う
    var err_st = 0
    console.log("読み込み待機開始");
    var read_st = 0;
    //ステータスチェック
    for (var n = 0 ; n < target_ticket_changed.length; n++){
      if (target_ticket_changed[n].readyState != 4){
        console.log(target_ticket_changed[n])
        read_st = 1;
      }
    }

    if(target_parent != null){
      if (target_parent.readyState != 4){
        read_st = 1;
      }
    }
    if (read_st == 0){
      console.log("読み込み完了！");
      console.log(target_ticket_changed);

      //エラーが無いかチェック
      for (var n = 0 ; n < target_ticket_changed.length; n++){
        if (target_ticket_changed[n].status != 200){
          err_st = 1;
        }
      }
      console.log('target_parentは'+target_parent);
      if(target_parent != null){
        if (target_parent.status != 200){
          err_st = 1;
        }
      }
      if (err_st != 1){
        //終了
        console.log('OK!returnする！');
        clearInterval(timerID_tar_ch_st);
        ch_alart = "親チケットID:"+parent_issue_status2.issue.id +"と子チケットの期日を一括変更しました"
        alert(ch_alart)
        return "end";
        //エラーだったらもう一周
      }else{
        clearInterval(timerID_tar_ch_st);
        console.log('もう一周');
        console.log("err_st" + err_st);
        //alert("なぜか更新できない・・・")
        target_change()
      }
    }
  },200);
}

//fromからtoの時間を計算するメソッド
function daytodaycal(fromy,fromm,fromd,toy,tom,tod) {
  if (fromy !== "" && fromm !== "" && fromd !== "") {
    var from = Date.parse(fromy+"/"+fromm+"/"+fromd); // From日付
  }

  if (toy !== "" && tom !== "" && tod !== "") {
    var to = Date.parse(toy+"/"+tom+"/"+tod); // To日付
  }

  if (from !== '' && to !== '') {
    var ans = (to - from)/1000/60/60/24; // 日数計算（単位がミリ秒なので日単位に変換）
    returnDate = Math.floor(ans); // 小数点以下を切り捨て

    if (isNaN(returnDate) || returnDate == 0) { // NaN(Not a 
Number)を出さないように
      var returnDate = 0;
    } else {
      return returnDate;
    }
  }
}

//日付から○日後の日付を計算
function daycal(y,m,d,l) {

  if (y !== "" && m !== "" && d !== "" && l !== "") {
    from = Date.parse(y+"/"+m+"/"+d); // スタート日付
    l_msec = (new Date(from)).getTime()+1000*60*60*24*l; //××日後のミリ秒を作成
  }

  if (from !== '' && l_msec !== '') {
    laterDate = new Date(l_msec);

    if (isNaN(laterDate) || laterDate == 0) {
      var returnDate = 0;
      } else {
      ansY = laterDate.getFullYear();
      ansM = laterDate.getMonth()+1;
      ansD = laterDate.getDate();
      ansW = "日月火水木金土".charAt(laterDate.getDay()); // 曜日
      return ansY+'-'+("0" + ansM).slice(-2)+'-'+("0" + ansD).slice(-2);
    }
  }
}

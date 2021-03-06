//No一括変更スクリプト

//仕様
//親チケットと子チケットに入力されたカスタムフィールドを全反映

$(function(){
var red_url = "http://*******/redmine"  //redmineのアドレス最後に/は必要ない
var textboxclass = ".cf_42";//乗っ取るテキストボックスのID名 「.」が必要
var No_id =  parseInt(textboxclass.replace(".cf_",""));//カスタムフィールドid。クラス名と同番号が振られているので、抽出する。
var parent_issue_status2;//parent_issue_status変数を配列に変換したものを格納
var target_ticket_issues = [];//変更するチケットのidが配列で入る
var target_ticket_changed = [];//変更したチケットの実行結果が入る
var target_parent;//親チケットの実行結果が入る
var ch_alart;
var change_No;

$(function () {
  //エラーチェック
  if ($(textboxclass).length >0 ){
    er = err_ch_no();
    if (er == "error"){
      console.log('エラーが存在するため終了');
      return;
    }
  }
  //テキストボックスを作成
  $(textboxclass).each(function() {
    //if($(this).text() != "[この値は変更しないでください]"){
      //権限が無い場合、この値が見えないので発動しない
      //return "error";
    //}
    //権限で絞る予定だったが廃止
    name =  $(this).parent().attr('id');
    No = $(this).text();
    $(this).text("");
    console.log(No);
    var targettext = "#No_" + name;
    $(this).append('<input type="text" id="No_" class="No_jquary">');
    $('#No_').attr('id', 'No_' + name) ;
  });


  //変更されたらスクリプトが発火
  $('.No_jquary').each(function(){
    console.log($(this).attr('id'))
    $('#' + $(this).attr('id')).change(function() {
      //入力された情報を取得
      change_No = $(this).val()
      console.log('入力された内容は' + change_No)
        //不正な値ならアラート&終了
      //チケット番号を取得
      var parent_issue_no = $(this).attr('id').replace("No_issue-","");
      //チケット情報を取得
       var parent_issue_status = $.getJSON(red_url + "/issues/" + 
parent_issue_no + ".json");
       timerID2 = setInterval( function(){
         if(parent_issue_status.readyState == 4){
           clearInterval(timerID2);
           parent_issue_status2 = 
JSON.parse(parent_issue_status.responseText);
           console.log(parent_issue_status2);
           issue_ikkatu_no()
         }
       },200);
    });
  });
});

function err_ch_no(){
  //アドレスが存在しているかもチェック

  var status_all = $.getJSON(red_url + "/issue_statuses.json");
  timerID2 = setInterval( function(){
    if(status_all.readyState == 4){
      console.log('読み込み完了');
      console.log(status_all);
      if(status_all.status == 200){
        console.log('ステータス正常');
        clearInterval(timerID2);
      }else{
        clearInterval(timerID2);
        alert("redmineアドレスが存在しません")
        return "error";
      }
    }
  },200);
}

function err_ch2_no(){
  //エラーチェックその２ 
選択されたチケットが親チケットでなかった場合、エラー
  console.log(target_ticket_issues);
  console.log("lengthは"+ target_ticket_issues.responseJSON.issues.length);
  if(target_ticket_issues.responseJSON.issues.length == 0 ){
      console.log("エラー");
      return "error";
  }
}

function issue_ikkatu_no() {
  var err_st = 0; //変更に失敗した場合、もう一度行う用のフラグ
  console.log('一括取得開始');
  console.log('ループ終了');
  console.log(timerID2);
  //失敗したらアラート&終了
    //未実装
  //プロジェクト名を取得
    pjid = parent_issue_status2.issue.project.id;
  //プロジェクト内のチケットを取得
  //全体の数を取得
  target_ticket_issues  = $.getJSON(red_url + "/projects/" + pjid + "/issues.json?limit=100&status_id=*&parent_id=" + 
parent_issue_status2.issue.id);
  timerID2 = setInterval( function(){
    if(target_ticket_issues.readyState == 4){
      er = err_ch2_no();
      if(er == "error") {
        clearInterval(timerID2);
        alert("選択されたチケットの子が見つかりません")
        return;//エラーチェックがエラーであればリターン
      }
      console.log('対象チケット取得');
      console.log('対象チケット取得');

      clearInterval(timerID2);
      target_change_no();
    }
  },200);
}

function target_change_no(){
    ch_alart = ""; //最後に変更した内容をおしらせする用
    //ターゲットとなるチケットが絞り込めたため、一括変更を開始。

    //Noを変更、ターゲットチケットの数だけ繰り返す
    for (var i = 0 ; i < target_ticket_issues.responseJSON.issues.length; i++){
      target_ticket_changed[i] = $.ajax({
        type: "PUT",
        url: red_url + "/issues/" + target_ticket_issues.responseJSON.issues[i].id +".json",
        data:{
          "issue": {
             "custom_field_values":{32:change_No}
          },
        }
      });
      
//wikiのどこにも載ってないけど、カスタムフィールドを更新する際は上記形式でないとダメっぽい
    }
    //親のNoを変更
     console.log('親を変更')
     console.log(parent_issue_status2.issue.id)
     console.log('Noフィールドid'+ No_id)
     console.log('変更No'+change_No)


      target_parent = $.ajax({
        type: "PUT",
        url: red_url + "/issues/" + parent_issue_status2.issue.id +".json",
        data:{
          "issue": {
               "custom_field_values":{32:change_No}
          },
        }
      });

    var put_c = put_check_no();
    console.log("put_c"+put_c);
    if (put_c == "end"){
      console.log('終了');
      clearInterval(timerID);
    }
}

function put_check_no() {
  timerID2 = setInterval( 
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
      if(target_parent != null){
        if (target_parent.status != 200){
          err_st = 1;
        }
      }
      if (err_st != 1){
        //終了
        console.log('OK!returnする！');
        clearInterval(timerID2);
        ch_alart = "親チケットID:"+parent_issue_status2.issue.id +"と子チケットのNoを変更しました"
        alert(ch_alart)
        return "end";
        //エラーだったらもう一周
      }else{
        clearInterval(timerID2);
        console.log('もう一周');
        console.log("err_st" + err_st);
        //alert("なぜか更新できない・・・")
        target_change()
      }
    }
  },200);
}

});

//�����ꊇ�ύX�X�N���v�g

//�q�`�P�b�g�̒x���\����ۂ����܂ܓ��t��ύX����
//�^�[�Q�b�g�ƂȂ�q�`�P�b�g�̊����ƁA�ύX�\��̊����̍������擾��
//���̌�A�S�q�`�P�b�g�ɍ�����K�p����B


$(function(){
var red_url = "http://*******/redmine" //redmine�̃A�h���X�B�Ō��/�͂���Ȃ� 
//redmine�̃A�h���X�Ō��/�͕K�v�Ȃ�
var textboxclass = ".cf_41";//������e�L�X�g�{�b�N�X��ID�� �u.�v���K�v
var targettracker = "�g���K�[�Ƃ���`�P�b�g�̍��ږ�";//���̃`�P�b�g�̓��t���`�F�b�N����
var status_id = "34" //34���u�ύX�����X�e�[�^�X�v;
var status_id_name = 
"�ύX�����X�e�[�^�X";//id�Ɩ��O����v���Ă��邩�m�F���邽�߂Ɏg�p
var end_st = ["����","��Ɗ���"]//���̖��O�ł���ꍇ�A���t���X�e�[�^�X���ύX���Ȃ��B
var ch_tar_st = "�M��"//�ύX�Ώۂ̃X�e�[�^�X���L��

var issuearry = [];//
var parent_issue_status2;//parent_issue_status�ϐ���z��ɕϊ��������̂��i�[
var target_ticket_issues = [];//�ύX����`�P�b�g��id���z��œ���
var target_ticket_changed = [];//�ύX�����`�P�b�g�̎��s���ʂ�����
var target_parent;//�e�`�P�b�g�̎��s���ʂ�����
var change_day;//�ύX������t���i�[
var sp_startdate; //�ύX����J�n�����擾
var sp_changedate;//�ύX����������擾
var ch_day_sabun ;//�ύX������̍������擾--��������������
var ch_alart;


$(function () {
  //�G���[�`�F�b�N
  if ($(textboxclass).length >0 ){
    er = err_ch();
    if (er == "error"){
      console.log('�G���[�����݂��邽�ߏI��');
      return;
    }
  }
  //�e�L�X�g�{�b�N�X���쐬
  $(textboxclass).each(function() {
    //if($(this).text() != "[���̒l�͕ύX���Ȃ��ł�������]"){
      //�����������ꍇ�A���̒l�������Ȃ��̂Ŕ������Ȃ�
    //  return "error";
    //}
    //�����ōi��\�肾�������p�~
    $(this).text("")
    name =  $(this).parent().attr('id')
    var targettext = "#text_" + name;
    $(this).append('<input type="text" id="text_" class="text_jquary">');
    $('#text_').attr('id', 'text_' + name) ;
    issuearry.push('#text_' + name);
    $(targettext).datepicker();

  });


  //�ύX���ꂽ��X�N���v�g������
  $('.text_jquary').each(function(){
    console.log($(this).attr('id'))
    $('#' + $(this).attr('id')).change(function() {
      //���͂��ꂽ�����擾
      change_day = $(this).val()
      console.log('���͂��ꂽ���e��' + change_day)
        //�s���Ȓl�Ȃ�A���[�g&�I��
      //�`�P�b�g�ԍ����擾
      var parent_issue_no = $(this).attr('id').replace("text_issue-","");
      //�`�P�b�g�����擾
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
  //�G���[�`�F�b�N
  //�X�e�[�^�Xid�����݂��Ă��邩�`�F�b�N
  //���łɃA�h���X�����݂��Ă��邩���`�F�b�N
  var status_all = $.getJSON(red_url + "/issue_statuses.json");
  timerID = setInterval( function(){
    if(status_all.readyState == 4){
      console.log('�ǂݍ��݊���');
      console.log(status_all);
      if(status_all.status == 200){
        console.log('�X�e�[�^�X����');
        clearInterval(timerID);
      }else{
        clearInterval(timerID);
        alert("redmine�A�h���X�����݂��܂���")
        return "error";
      }

      for (var i = 0 ; i < status_all.length; i++){
        if (status_all.responseJSON.issue_statuses[i].id == status_id){
          if (status_all.responseJSON.issue_statuses[i].name != status_id_name){
            clearInterval(timerID);
            alert("�X�e�[�^�Xid�����݂��܂���")
            return "error";
          }
        }
      }
    }
  },200);
}


function err_ch2(){
  //�G���[�`�F�b�N���̂Q 
�I�����ꂽ�`�P�b�g���e�`�P�b�g�łȂ������ꍇ�A�G���[
  console.log(target_ticket_issues);
  console.log("length��"+ target_ticket_issues.responseJSON.issues.length);
  if(target_ticket_issues.responseJSON.issues.length == 0 ){
      console.log("�G���[");
      return "error";
  }
}

function issue_ikkatu() {
  var err_st = 0; //�ύX�Ɏ��s�����ꍇ�A������x�s���p�̃t���O
  console.log('�ꊇ�擾�J�n');
  console.log('���[�v�I��');
  console.log(timerID);
  //���s������A���[�g&�I��
    //������
  //�v���W�F�N�g�����擾
    pjid = parent_issue_status2.issue.project.id;
  //�v���W�F�N�g���̃`�P�b�g���擾
  //�S�̂̐����擾
  target_ticket_issues  = $.getJSON(red_url + "/projects/" + pjid + "/issues.json?limit=100&status_id=*&parent_id=" + parent_issue_status2.issue.id);
  timerID = setInterval( function(){
    if(target_ticket_issues.readyState == 4){
      er = err_ch2();
      if(er == "error") {
        clearInterval(timerID);
        alert("�I�����ꂽ�`�P�b�g�̎q��������܂���")
        return;//�G���[�`�F�b�N���G���[�ł���΃��^�[��
      }
      console.log('�Ώۃ`�P�b�g�擾');
      clearInterval(timerID);
      target_change();
    }
  },200);
}

function target_change(){
    ch_alart = ""; //�Ō�ɕύX�������e�������点����p
    //�^�[�Q�b�g�ƂȂ�`�P�b�g���i�荞�߂����߁A�ꊇ�ύX���J�n�B
    //��Ǝ��{�̊J�n�����擾
    for (var i = 0 ; i < 
target_ticket_issues.responseJSON.issues.length; i++){
      if(target_ticket_issues.responseJSON.issues[i].tracker.name == targettracker ){
        sp_startdate = target_ticket_issues.responseJSON.issues[i].start_date.split('-');
        sp_changedate = change_day.split('/');
        ch_day_sabun 
=daytodaycal(sp_startdate[0],sp_startdate[1],sp_startdate[2],sp_changedate[0],sp_changedate[1],sp_changedate[2]);
      }
    }
    //���t��ύX�A�^�[�Q�b�g�`�P�b�g�̐������J��Ԃ�
    for (var i = 0 ; i < target_ticket_issues.responseJSON.issues.length; i++){
      var sp_targetst = target_ticket_issues.responseJSON.issues[i].start_date.split("-");
      var sp_targetdu = target_ticket_issues.responseJSON.issues[i].due_date.split("-");
      console.log('�`�P�b�g�ҏW'+i)
      //�`�P�b�g�X�e�[�^�X�������ł���Ή����s��Ȃ�
if(end_st.indexOf(target_ticket_issues.responseJSON.issues[i].status.name) == -1){
        if(target_ticket_issues.responseJSON.issues[i].status.name == "������"){
          console.log('�����ł͂Ȃ����A�X�e�[�^�X��������'+i)
          //�`�P�b�g�X�e�[�^�X�������łȂ����̂Ɋւ��ē��t�̕ύX���s���B
          //���X�e�[�^�X���������̂��̂�ΏۂƂ���
          console.log('�J�n��' + sp_targetst);
          console.log('����' + sp_targetdu);
          console.log('�J�n�ύX��' + daycal(sp_targetst[0],sp_targetst[1],sp_targetst[2],ch_day_sabun));
          console.log('�����ύX' + daycal(sp_targetdu[0],sp_targetdu[1],sp_targetdu[2],ch_day_sabun));
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
          //�X�e�[�^�X���������ł͂Ȃ����͓̂��t����������
          console.log('�J�n��' + sp_targetst);
          console.log('����' + sp_targetdu);
          console.log('�J�n�ύX��' + daycal(sp_targetst[0],sp_targetst[1],sp_targetst[2],ch_day_sabun));
          console.log('�����ύX' + daycal(sp_targetdu[0],sp_targetdu[1],sp_targetdu[2],ch_day_sabun));
          console.log('�X�e�[�^�X���������ł͂Ȃ�'+i)
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
        console.log('�����`�P�b�g�̓X�L�b�v'+i)
      }
    }
    //�e�̃X�e�[�^�X��ύX
    if (parent_issue_status2.issue.status.name == "������"){
     console.log('�e��ύX')
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
      console.log('�I��');
      clearInterval(timerID_tar_ch);
    }
}

function put_check() {
  timerID_tar_ch_st = setInterval( 
function(){//�X�e�[�^�X���S�ēǂݍ��݊����ɂȂ�����G���[�`�F�b�N���s��
    var err_st = 0
    console.log("�ǂݍ��ݑҋ@�J�n");
    var read_st = 0;
    //�X�e�[�^�X�`�F�b�N
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
      console.log("�ǂݍ��݊����I");
      console.log(target_ticket_changed);

      //�G���[���������`�F�b�N
      for (var n = 0 ; n < target_ticket_changed.length; n++){
        if (target_ticket_changed[n].status != 200){
          err_st = 1;
        }
      }
      console.log('target_parent��'+target_parent);
      if(target_parent != null){
        if (target_parent.status != 200){
          err_st = 1;
        }
      }
      if (err_st != 1){
        //�I��
        console.log('OK!return����I');
        clearInterval(timerID_tar_ch_st);
        ch_alart = "�e�`�P�b�gID:"+parent_issue_status2.issue.id +"�Ǝq�`�P�b�g�̊������ꊇ�ύX���܂���"
        alert(ch_alart)
        return "end";
        //�G���[��������������
      }else{
        clearInterval(timerID_tar_ch_st);
        console.log('�������');
        console.log("err_st" + err_st);
        //alert("�Ȃ����X�V�ł��Ȃ��E�E�E")
        target_change()
      }
    }
  },200);
}

//from����to�̎��Ԃ��v�Z���郁�\�b�h
function daytodaycal(fromy,fromm,fromd,toy,tom,tod) {
  if (fromy !== "" && fromm !== "" && fromd !== "") {
    var from = Date.parse(fromy+"/"+fromm+"/"+fromd); // From���t
  }

  if (toy !== "" && tom !== "" && tod !== "") {
    var to = Date.parse(toy+"/"+tom+"/"+tod); // To���t
  }

  if (from !== '' && to !== '') {
    var ans = (to - from)/1000/60/60/24; // �����v�Z�i�P�ʂ��~���b�Ȃ̂œ��P�ʂɕϊ��j
    returnDate = Math.floor(ans); // �����_�ȉ���؂�̂�

    if (isNaN(returnDate) || returnDate == 0) { // NaN(Not a 
Number)���o���Ȃ��悤��
      var returnDate = 0;
    } else {
      return returnDate;
    }
  }
}

//���t���灛����̓��t���v�Z
function daycal(y,m,d,l) {

  if (y !== "" && m !== "" && d !== "" && l !== "") {
    from = Date.parse(y+"/"+m+"/"+d); // �X�^�[�g���t
    l_msec = (new Date(from)).getTime()+1000*60*60*24*l; //�~�~����̃~���b���쐬
  }

  if (from !== '' && l_msec !== '') {
    laterDate = new Date(l_msec);

    if (isNaN(laterDate) || laterDate == 0) {
      var returnDate = 0;
      } else {
      ansY = laterDate.getFullYear();
      ansM = laterDate.getMonth()+1;
      ansD = laterDate.getDate();
      ansW = "�����ΐ��؋��y".charAt(laterDate.getDay()); // �j��
      return ansY+'-'+("0" + ansM).slice(-2)+'-'+("0" + ansD).slice(-2);
    }
  }
}

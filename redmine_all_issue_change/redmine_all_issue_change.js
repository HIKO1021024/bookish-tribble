//No�ꊇ�ύX�X�N���v�g

//�d�l
//�e�`�P�b�g�Ǝq�`�P�b�g�ɓ��͂��ꂽ�J�X�^���t�B�[���h��S���f

$(function(){
var red_url = "http://*******/redmine"  //redmine�̃A�h���X�Ō��/�͕K�v�Ȃ�
var textboxclass = ".cf_42";//������e�L�X�g�{�b�N�X��ID�� �u.�v���K�v
var No_id =  parseInt(textboxclass.replace(".cf_",""));//�J�X�^���t�B�[���hid�B�N���X���Ɠ��ԍ����U���Ă���̂ŁA���o����B
var parent_issue_status2;//parent_issue_status�ϐ���z��ɕϊ��������̂��i�[
var target_ticket_issues = [];//�ύX����`�P�b�g��id���z��œ���
var target_ticket_changed = [];//�ύX�����`�P�b�g�̎��s���ʂ�����
var target_parent;//�e�`�P�b�g�̎��s���ʂ�����
var ch_alart;
var change_No;

$(function () {
  //�G���[�`�F�b�N
  if ($(textboxclass).length >0 ){
    er = err_ch_no();
    if (er == "error"){
      console.log('�G���[�����݂��邽�ߏI��');
      return;
    }
  }
  //�e�L�X�g�{�b�N�X���쐬
  $(textboxclass).each(function() {
    //if($(this).text() != "[���̒l�͕ύX���Ȃ��ł�������]"){
      //�����������ꍇ�A���̒l�������Ȃ��̂Ŕ������Ȃ�
      //return "error";
    //}
    //�����ōi��\�肾�������p�~
    name =  $(this).parent().attr('id');
    No = $(this).text();
    $(this).text("");
    console.log(No);
    var targettext = "#No_" + name;
    $(this).append('<input type="text" id="No_" class="No_jquary">');
    $('#No_').attr('id', 'No_' + name) ;
  });


  //�ύX���ꂽ��X�N���v�g������
  $('.No_jquary').each(function(){
    console.log($(this).attr('id'))
    $('#' + $(this).attr('id')).change(function() {
      //���͂��ꂽ�����擾
      change_No = $(this).val()
      console.log('���͂��ꂽ���e��' + change_No)
        //�s���Ȓl�Ȃ�A���[�g&�I��
      //�`�P�b�g�ԍ����擾
      var parent_issue_no = $(this).attr('id').replace("No_issue-","");
      //�`�P�b�g�����擾
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
  //�A�h���X�����݂��Ă��邩���`�F�b�N

  var status_all = $.getJSON(red_url + "/issue_statuses.json");
  timerID2 = setInterval( function(){
    if(status_all.readyState == 4){
      console.log('�ǂݍ��݊���');
      console.log(status_all);
      if(status_all.status == 200){
        console.log('�X�e�[�^�X����');
        clearInterval(timerID2);
      }else{
        clearInterval(timerID2);
        alert("redmine�A�h���X�����݂��܂���")
        return "error";
      }
    }
  },200);
}

function err_ch2_no(){
  //�G���[�`�F�b�N���̂Q 
�I�����ꂽ�`�P�b�g���e�`�P�b�g�łȂ������ꍇ�A�G���[
  console.log(target_ticket_issues);
  console.log("length��"+ target_ticket_issues.responseJSON.issues.length);
  if(target_ticket_issues.responseJSON.issues.length == 0 ){
      console.log("�G���[");
      return "error";
  }
}

function issue_ikkatu_no() {
  var err_st = 0; //�ύX�Ɏ��s�����ꍇ�A������x�s���p�̃t���O
  console.log('�ꊇ�擾�J�n');
  console.log('���[�v�I��');
  console.log(timerID2);
  //���s������A���[�g&�I��
    //������
  //�v���W�F�N�g�����擾
    pjid = parent_issue_status2.issue.project.id;
  //�v���W�F�N�g���̃`�P�b�g���擾
  //�S�̂̐����擾
  target_ticket_issues  = $.getJSON(red_url + "/projects/" + pjid + "/issues.json?limit=100&status_id=*&parent_id=" + 
parent_issue_status2.issue.id);
  timerID2 = setInterval( function(){
    if(target_ticket_issues.readyState == 4){
      er = err_ch2_no();
      if(er == "error") {
        clearInterval(timerID2);
        alert("�I�����ꂽ�`�P�b�g�̎q��������܂���")
        return;//�G���[�`�F�b�N���G���[�ł���΃��^�[��
      }
      console.log('�Ώۃ`�P�b�g�擾');
      console.log('�Ώۃ`�P�b�g�擾');

      clearInterval(timerID2);
      target_change_no();
    }
  },200);
}

function target_change_no(){
    ch_alart = ""; //�Ō�ɕύX�������e�������点����p
    //�^�[�Q�b�g�ƂȂ�`�P�b�g���i�荞�߂����߁A�ꊇ�ύX���J�n�B

    //No��ύX�A�^�[�Q�b�g�`�P�b�g�̐������J��Ԃ�
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
      
//wiki�̂ǂ��ɂ��ڂ��ĂȂ����ǁA�J�X�^���t�B�[���h���X�V����ۂ͏�L�`���łȂ��ƃ_�����ۂ�
    }
    //�e��No��ύX
     console.log('�e��ύX')
     console.log(parent_issue_status2.issue.id)
     console.log('No�t�B�[���hid'+ No_id)
     console.log('�ύXNo'+change_No)


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
      console.log('�I��');
      clearInterval(timerID);
    }
}

function put_check_no() {
  timerID2 = setInterval( 
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
      if(target_parent != null){
        if (target_parent.status != 200){
          err_st = 1;
        }
      }
      if (err_st != 1){
        //�I��
        console.log('OK!return����I');
        clearInterval(timerID2);
        ch_alart = "�e�`�P�b�gID:"+parent_issue_status2.issue.id +"�Ǝq�`�P�b�g��No��ύX���܂���"
        alert(ch_alart)
        return "end";
        //�G���[��������������
      }else{
        clearInterval(timerID2);
        console.log('�������');
        console.log("err_st" + err_st);
        //alert("�Ȃ����X�V�ł��Ȃ��E�E�E")
        target_change()
      }
    }
  },200);
}

});
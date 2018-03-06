import angular from 'angular'
import MemberCtrl from './member.controller'
import UserCenterCtrl from '../member_user_center/user_center.controller'
import TopUpCtrl from '../member_top_up/member_top_up.controller'
import TransactionCtrl from '../member_transaction/member_transaction.controller'
import DetailSetCtrl from '../member_detail_set/member_detail_set.controller'
import NoticeCtrl from '../member_notice/member_notice.controller'
import WithdrawCtrl from '../member_withdraw/member_withdraw.controller'
import TopUpRecordCtrl from '../member_top_up_record/member_top_up_record.controller'
import WithdrawRecordCtrl from '../member_withdraw_record/member_withdraw_record.controller'
import TopUpCompanyCtrl from '../member_top_up_company/member_top_up_company.controller'
import Agent_account_detailCtrl from '../agent_account_detail/agent_account_detail.controller'
import Agent_applyCtrl from '../agent_apply/agent_apply.controller'
import Agent_bet_recordCtrl from '../agent_bet_record/agent_bet_record.controller'
import Agent_chargeCtrl from '../agent_charge/agent_charge.controller'
import Agent_infoCtrl from '../agent_info/agent_info.controller'
import Agent_reportCtrl from '../agent_report/agent_report.controller'
import Agent_userCtrl from '../agent_user/agent_user.controller'

// import TopUpCompanyCtrl from '../member_top_up_company/member_top_up_company.controller'
// import TopUpCompanyCtrl from '../member_top_up_company/member_top_up_company.controller'
// import MemberCtrl from './member.controller'
// import MemberComponent from './member.component'
// import Member_headCtrl from '../member_head/member_head.controller'
// import Member_navCtrl from '../member_nav/member_nav.controller'
// MemberComponent.controller = MemberCtrl
import './member.less'
import '../member_top_up/member_top_up.less'
import '../member_transaction/member_transaction.less'
import '../member_detail_set/member_detail_set.less'
import '../member_notice/member_notice.less'
import '../member_withdraw/member_withdraw.less'
import '../member_top_up_record/member_top_up_record.less'
import '../member_withdraw_record/member_withdraw_record.less'
import '../member_top_up_company/member_top_up_company.less'

import '../agent_report/agent_report.less'
import '../agent_charge/agent_charge.less'
import '../agent_apply/agent_apply.less'
import '../agent_account_detail/agent_account_detail.less'
import '../agent_bet_record/agent_bet_record.less'
import '../agent_info/agent_info.less'
import '../agent_user/agent_user.less'
import '../member_user_nav/member_user_nav.less'

const member = angular.module('main.member', [])
	.config(function ($stateProvider) {
		//$stateProvider.state('member', MemberComponent)
        $stateProvider
			.state('member', {
				url: '/member',
				abstract: true,
				controller: MemberCtrl,
				templateUrl: 'src/components/member/member.tpl.html',
				cache: false
        	})
			.state('member.user_center', {
				url: '/user_center',
                controller: UserCenterCtrl,
                templateUrl: 'src/components/member_user_center/user_center.tpl.html',
                cache: false
			})
            .state('member.member_top_up', {
                url: '/member_top_up',
                controller: TopUpCtrl,
                templateUrl: 'src/components/member_top_up/member_top_up.tpl.html',
                cache: false
            })
            .state('member.member_transaction', {
                url: '/member_transaction',
                controller: TransactionCtrl,
                templateUrl: 'src/components/member_transaction/member_transaction.tpl.html',
                cache: false
            })
            .state('member.member_detail_set', {
                url: '/member_detail_set',
                controller: DetailSetCtrl,
                templateUrl: 'src/components/member_detail_set/member_detail_set.tpl.html',
                cache: false
            })
            .state('member.member_notice', {
                url: '/member_notice',
                controller: NoticeCtrl,
                templateUrl: 'src/components/member_notice/member_notice.tpl.html',
                cache: false
            })
            .state('member.member_withdraw', {
                url: '/member_withdraw',
                controller: WithdrawCtrl,
                templateUrl: 'src/components/member_withdraw/member_withdraw.tpl.html',
                cache: false
            })
            .state('member.member_top_up_record', {
                url: '/member_top_up_record',
                controller: TopUpRecordCtrl,
                templateUrl: 'src/components/member_top_up_record/member_top_up_record.tpl.html',
                cache: false
            })
            .state('member.member_withdraw_record', {
                url: '/member_withdraw_record',
                controller: WithdrawRecordCtrl,
                templateUrl: 'src/components/member_withdraw_record/member_withdraw_record.tpl.html',
                cache: false
            })
            .state('member.member_top_up_company', {
                url: '/member_top_up_company',
                controller: TopUpCompanyCtrl,
                templateUrl: 'src/components/member_top_up_company/member_top_up_company.tpl.html',
                cache: false
            })
            .state('member.agent_account_detail', {
                url: '/agent_account_detail',
                controller: Agent_account_detailCtrl,
                templateUrl: 'src/components/agent_account_detail/agent_account_detail.tpl.html',
                cache: false
            })
            .state('member.agent_apply', {
                url: '/agent_apply',
                controller: Agent_applyCtrl,
                templateUrl: 'src/components/agent_apply/agent_apply.tpl.html',
                cache: false
            })
            .state('member.agent_bet_record', {
                url: '/agent_bet_record',
                controller: Agent_bet_recordCtrl,
                templateUrl: 'src/components/agent_bet_record/agent_bet_record.tpl.html',
                cache: false
            })
            .state('member.agent_charge', {
                url: '/agent_charge',
                controller: Agent_chargeCtrl,
                templateUrl: 'src/components/agent_charge/agent_charge.tpl.html',
                cache: false
            })
            .state('member.agent_info', {
                url: '/agent_info',
                controller: Agent_infoCtrl,
                templateUrl: 'src/components/agent_info/agent_info.tpl.html',
                cache: false
            })
            .state('member.agent_report', {
                url: '/agent_report',
                controller: Agent_reportCtrl,
                templateUrl: 'src/components/agent_report/agent_report.tpl.html',
                cache: false
            })
            .state('member.agent_user', {
                url: '/agent_user',
                controller: Agent_userCtrl,
                templateUrl: 'src/components/agent_user/agent_user.tpl.html',
                cache: false
            })
            // .state('member.member_top_up_company', {
            //     url: '/member_top_up_company',
            //     controller: TopUpCompanyCtrl,
            //     templateUrl: 'src/components/member_top_up_company/member_top_up_company.tpl.html',
            //     cache: false
            // })
	})
	//.controller('Member_headCtrl', Member_headCtrl)
    //.controller('Member_navCtrl', Member_navCtrl)
	.name

export default member
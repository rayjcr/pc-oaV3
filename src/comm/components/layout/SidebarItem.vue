<template>
	<div class='menu-wrapper'>

	<template v-for="item in routes">

		<el-submenu :index="item.id" class="NavItem" v-if='item.children&&item.children.length>0'>
			<template slot="title">
				<!-- <icon-svg v-if='item.icon' :icon-class="item.icon"></icon-svg> -->
				<span>{{item.title}}</span>				
			</template>
			<template v-for="child in item.children">
		
				<sidebar-item class='nest-menu' v-if='child.children&&child.children.length>0' :routes='[child]'> </sidebar-item>
				<router-link v-else :to="'/'+item.code+'/'+child.code">
					<el-menu-item :index="item.code+'/'+child.code">
						<!-- <icon-svg v-if='child.icon' :icon-class="child.icon"></icon-svg> -->
						<span>{{child.title}}</span>
					</el-menu-item>
				</router-link>
			</template>
		</el-submenu>
		
		<router-link v-else :to="'/'+curPath[1]+'/'+item.code">
			<el-menu-item class="NavItemOne" :index="item.id">
				<!-- <icon-svg v-if='item.icon' :icon-class="item.icon"></icon-svg> -->
				<span>{{item.title}}</span>
			</el-menu-item>
		</router-link>

	</template>

	</div>
</template>

<script>
export default {
	name: 'SidebarItem',
	props: {
		routes: {
			//type: Array
		},
		curPath:{
			type: Array
		}
	},
	data(){
		return{
		}
	},
	mounted(){
	},
}
</script>

<style lang="scss" scoped>
a:link {
    text-decoration:none;
}
a:active{
    text-decoration:none; 
}
a:visited{
    text-decoration:none;
} 
a:hover {
    text-decoration:none;
}
.NavItem /deep/ .el-submenu__title{
	background: #2a2f55;
	color: rgba(192, 197, 235, .6);
	position: relative;
}
.NavItem /deep/ .el-submenu__title:hover,.NavItemOne:hover /deep/{
	background: #2e3461;
    color: #c0c5eb;
}
// .NavItem /deep/ .el-submenu__title:hover::after,.NavItemOne:hover::after /deep/{
//     content: '\20';
//     width: 6px;
//     height: 100%;
//     background: #3f67ff;
//     position: absolute;
//     top: 0;
//     left: 0;
// }
.NavItem /deep/ .el-submenu__title{
	width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    padding-left: 45px !important;
    position: relative;
    cursor: pointer;
}
.NavItemOne /deep/{
	width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    padding-left: 45px !important;
    position: relative;
	cursor: pointer;
	background-color: #2a2f55;
	color: rgba(192, 197, 235, .6);
}
.NavItem /deep/ .el-menu-item{
	width: 100%;
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    padding-left: 75px !important;
    position: relative;
	cursor: pointer;
	background: #2a2f55;
	color: rgba(192, 197, 235, .6);
	position: relative;
}
.NavItem /deep/ .el-menu-item:hover{
	background: #2e3461;
    color: #c0c5eb;
}
.NavItem /deep/ .router-link-active .el-menu-item,/deep/ .router-link-active .NavItemOne{
	background: #2e3461;
    color: #c0c5eb;
}
.NavItem /deep/ .router-link-active .el-menu-item::after,/deep/ .router-link-active .NavItemOne::after{
	content: '\20';
    width: 6px;
    height: 100%;
    background: #3f67ff;
    position: absolute;
    top: 0;
    left: 0;
}

</style>


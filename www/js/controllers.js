angular.module('dynamic-sports.controllers', [])
.controller('HomeCtrl', function($scope) {
  console.log('HomeCtrl');
});
// .controller('PetIndexCtrl', function($scope, PetService) {
//   $scope.pets = PetService.all();
// })
// .controller('PetDetailCtrl', function($scope, $stateParams, PetService) {
//   $scope.pet = PetService.get($stateParams.petId);
// });